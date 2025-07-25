import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { catchAsync, createError } from "../middleware/errorHandler";
import mongoose from "mongoose";
import { Category, Project } from "../models";
import { CategoryValue } from "../models/CategoryValue";
import { generatedContent } from "../helper/projectGeneratorSwitch";

export const createProject = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const { name, description, blueprintId, categoryId } =
      (req.body as {
        name: string;
        description: string;
        blueprintId: mongoose.Types.ObjectId;
        categoryId: mongoose.Types.ObjectId[];
      }) || {};

    if (!name || !blueprintId || !categoryId || !categoryId.length) {
      return next(createError("Missing required fields", 400));
    }

    const alreadyExist = await Project.findOne({
      name,
      userId: req.user.id,
    });

    if (alreadyExist) {
      return next(createError("Project with same name already exists", 400));
    }

    const project = new Project({
      name,
      description,
      userId: (req.user as { id: string; email: string; role: string }).id,
      blueprintId,
      categoryId,
    });

    //save the projects
    await project.save();

    res.json({
      success: true,
      data: project,
    });
  }
);

export const generateProject = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const { category, project, values, blueprintId, currentCategory } =
      req.body as {
        category: string;
        project: string;
        values: { [key: string]: string };
        blueprintId: string;
        currentCategory: string;
      };

    // Set up SSE headers
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    });


    // Stream initial progress
    res.write(
      JSON.stringify({
        type: "progress",
        message: "Processing field values...",
        progress: 10,
      }) + "\n"
    );

    const fieldValue = Object.keys(values).map((key) => {
      return {
        key: key?.split("-")[0] || "",
        value:
          typeof values[key] === "string"
            ? [values[key]]
            : values[key] || [""],
      };
    });

    let isExistedValue = await CategoryValue.findOne({
      project,
      category: currentCategory,
    });

    if (isExistedValue) {
      isExistedValue.value = fieldValue;
    } else {
      isExistedValue = new CategoryValue({
        category: currentCategory,
        project,
        value: fieldValue,
      });
    }

    // Stream progress update
    res.write(
      JSON.stringify({
        type: "progress",
        message: "Fetching blueprint values...",
        progress: 30,
      }) + "\n"
    );

    const blueprintValues = (
      (await CategoryValue.find({ blueprint: blueprintId })
        .populate("category")
        .lean()) as any[]
    ).map((blue) => ({ title: blue.category.title, values: blue.value }));

    // Stream blueprint values
    res.write(
      JSON.stringify({
        type: "data",
        key: "blueprintValues",
        value: blueprintValues,
        progress: 50,
      }) + "\n"
    );

    // Stream progress update
    res.write(
      JSON.stringify({
        type: "progress",
        message: "Generating AI content...",
        progress: 70,
      }) + "\n"
    );

    const categoryData = await Category.findById(currentCategory).lean();

    console.log("categoryData", categoryData?.title);

    let aiGeneratedContent: string | null = await generatedContent({ blueprintValues, fieldValue, res, title: categoryData?.title || '' });


    if (!aiGeneratedContent) {
      res.write(
        JSON.stringify({
          type: "error",
          message: "Failed to generate project",
        }) + "\n"
      );
      return res.end();
    }

    // Stream final AI generated content
    res.write(
      JSON.stringify({
        type: "data",
        key: "aiContent",
        value: aiGeneratedContent,
        progress: 90,
      }) + "\n"
    );

    // Stream field values
    res.write(
      JSON.stringify({
        type: "data",
        key: "fieldValue",
        value: fieldValue,
        progress: 95,
      }) + "\n"
    );

    // Stream completion
    res.write(
      JSON.stringify({
        type: "complete",
        message: "Project generation completed successfully",
        progress: 100,
        data: {
          success: true,
          blueprintValues,
          fieldValue,
          aiContent: aiGeneratedContent,
        },
      }) + "\n"
    );

    isExistedValue.isAiGeneratedContent = aiGeneratedContent;
    await isExistedValue.save();
    res.end();
    res.status(200).json({
      success: true,
      data: {
        success: true,
        categoryValueId: isExistedValue._id,
      },
    });

  }
);

export const singleProject = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError("Invalid project ID", 400));
    }

    // Fetch project with populated fields
    const project = (await Project.findOne({ _id: id, userId: req.user.id })
      .populate("categoryId")
      .populate("blueprintId", "_id title")
      .lean()) as any;

    if (!project) {
      return next(createError("Project not found", 404));
    }

    // Extract all category IDs for batch processing
    const rootCategoryIds = project.categoryId.map((cat: any) => cat._id);

    // Batch fetch all categories in the hierarchy
    const [allSubCategories, allThirdCategories, allCategoryValues] = await Promise.all([
      // Get all subcategories for root categories
      Category.find({
        parentId: { $in: rootCategoryIds },
        type: "project",
      }).lean(),

      // Get all third-level categories (we'll filter by subcategory IDs after)
      Category.find({
        type: "project",
        parentId: { $exists: true, $ne: null }
      }).lean(),

      // Get all category values for this project
      CategoryValue.find({
        project: id,
      }).lean()
    ]);

    // Get subcategory IDs for third-level category filtering
    const subCategoryIds = allSubCategories.map(sub => sub._id);

    // Filter third-level categories to only those belonging to our subcategories
    const thirdCategories = allThirdCategories.filter(third =>
      subCategoryIds.some(subId => subId.toString() === third.parentId?.toString())
    );

    // Create lookup maps for O(1) access
    const categoryValueMap = new Map();
    allCategoryValues.forEach(cv => {
      categoryValueMap.set(cv.category.toString(), cv);
    });

    const subCategoryMap = new Map();
    allSubCategories.forEach(sub => {
      const parentId = sub?.parentId?.toString();
      if (!subCategoryMap.has(parentId)) {
        subCategoryMap.set(parentId, []);
      }
      subCategoryMap.get(parentId).push(sub);
    });

    const thirdCategoryMap = new Map();
    thirdCategories.forEach(third => {
      const parentId = third?.parentId?.toString();
      if (!thirdCategoryMap.has(parentId)) {
        thirdCategoryMap.set(parentId, []);
      }
      thirdCategoryMap.get(parentId).push(third);
    });

    // Build nested category structure using maps
    const buildCategoryTree = (categories: any[]) => {
      return categories.map(category => {
        const categoryId = category._id.toString();
        const subCategories = subCategoryMap.get(categoryId) || [];

        const categoryWithChildren = {
          ...category,
          subCategories: subCategories.map((subCategory: any) => {
            const subCategoryId = subCategory._id.toString();
            const thirdCategoriesForSub = thirdCategoryMap.get(subCategoryId) || [];

            return {
              ...subCategory,
              thirdCategories: thirdCategoriesForSub.map((thirdCategory: any) => ({
                ...thirdCategory,
                fieldValue: categoryValueMap.get(thirdCategory._id.toString()) || null,
              })),
              fieldValue: categoryValueMap.get(subCategoryId) || null,
            };
          }),
          fieldValue: categoryValueMap.get(categoryId) || null,
        };

        return categoryWithChildren;
      });
    };

    // Build the nested category structure
    const nestedCategories = buildCategoryTree(project.categoryId);

    res.json({
      success: true,
      data: {
        ...project,
        categoryId: nestedCategories,
      },
    });
  }
);

export const allProject = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }
    const projects = (await Project.find({ userId: req.user.id })
      .populate("categoryId")
      .populate("blueprintId", "_id title")
      .sort({ createdAt: -1 })
      .lean()) as any;

    if (!projects) {
      return next(createError("Project not found", 404));
    }

    res.json({
      success: true,
      data: projects,
    });
  }
);

export const deleteProject = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return next(createError("Project not found", 404));
    }
    res.json({
      success: true,
      data: project,
    });
  }
);
