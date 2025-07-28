import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { catchAsync, createError } from "../middleware/errorHandler";
import mongoose from "mongoose";
import { Category, Project, User } from "../models";
import { CategoryValue } from "../models/CategoryValue";
import { generatedContent } from "../helper/projectGeneratorSwitch";
import { continuousProjectGenerator } from "../helper/continuousProjectGenerator";
import { updateUserWordCount } from "../utils";

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

    // Set up proper SSE headers for streaming
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control, Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    });

    // Helper function to send SSE data
    const sendSSE = (data: any) => {
      const sseData = `data: ${JSON.stringify(data)}\n\n`;
      res.write(sseData);
    };

    try {
      // Test streaming setup
      console.log("Starting streaming test...");
      sendSSE({
        type: "test",
        message: "Streaming test successful",
        timestamp: new Date().toISOString(),
      });

      // Stream initial progress
      sendSSE({
        type: "progress",
        message: "Processing field values...",
        progress: 10,
      });

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
      sendSSE({
        type: "progress",
        message: "Fetching blueprint values...",
        progress: 30,
      });

      const blueprintValues = (
        (await CategoryValue.find({ blueprint: blueprintId })
          .populate("category")
          .lean()) as any[]
      ).map((blue) => ({ title: blue.category.title, values: blue.value }));

      // Stream blueprint values
      sendSSE({
        type: "data",
        key: "blueprintValues",
        value: blueprintValues,
        progress: 50,
      });

      // Stream progress update
      sendSSE({
        type: "progress",
        message: "Generating AI content...",
        progress: 70,
      });

      const categoryData = await Category.findById(currentCategory).lean();

      // Determine main category by finding the root category
      let mainCategory = categoryData?.title || '' ;
      if (categoryData?.parentId) {
        // If this category has a parent, find the root category
        let currentCategory = categoryData;
        while (currentCategory.parentId) {
          const parentCategory = await Category.findById(currentCategory.parentId).lean();
          if (parentCategory) {
            currentCategory = parentCategory;
          } else {
            break;
          }
        }
        mainCategory = currentCategory.title;
      }

      // Fetch homepage reference only for website pages (excluding homepage generators)
      let homepageReference = '';
      if (mainCategory === 'Website Pages' && 
          categoryData?.title !== 'Simple Home Page' && 
          categoryData?.title !== 'Landing Page Generator') {
        // Find homepage reference from the same project
        const homepageCategoryValue = await CategoryValue.findOne({
          project,
          $or: [
            { 'category': { $in: await Category.find({ title: 'Simple Home Page' }).distinct('_id') } },
            { 'category': { $in: await Category.find({ title: 'Landing Page Generator' }).distinct('_id') } }
          ]
        }).populate('category').lean();
        
        if (homepageCategoryValue?.homepageReference) {
          homepageReference = homepageCategoryValue.homepageReference;
        }
      }

      let aiGeneratedContent: string | null = await generatedContent({ 
        blueprintValues, 
        fieldValue, 
        res, 
        title: categoryData?.title || '',
        sendSSE,
        mainCategory,
        homepageReference,
      });

      if (!aiGeneratedContent) {
        sendSSE({
          type: "error",
          message: "Failed to generate project",
        });
        return res.end();
      }

      // Stream final AI generated content
      sendSSE({
        type: "data",
        key: "aiContent",
        value: aiGeneratedContent,
        progress: 90,
      });

      // Stream field values
      sendSSE({
        type: "data",
        key: "fieldValue",
        value: fieldValue,
        progress: 95,
      });

      // Update user word count
      try {
        const wordCountResult = await updateUserWordCount(req.user.id, aiGeneratedContent, User);
        
        // Stream completion with word count info
        sendSSE({
          type: "complete",
          message: "Project generation completed successfully",
          progress: 100,
          data: {
            success: true,
            blueprintValues,
            fieldValue,
            aiContent: aiGeneratedContent,
            wordCount: {
              wordsUsed: wordCountResult.wordsUsed,
              wordsLeft: wordCountResult.wordsLeft,
              wordsInContent: wordCountResult.wordsInContent || 0
            }
          },
        });
      } catch (wordCountError) {
        console.error("Error updating word count:", wordCountError);
        // Still send completion but without word count
        sendSSE({
          type: "complete",
          message: "Project generation completed successfully",
          progress: 100,
          data: {
            success: true,
            blueprintValues,
            fieldValue,
            aiContent: aiGeneratedContent,
          },
        });
      }

      isExistedValue.isAiGeneratedContent = aiGeneratedContent;
      
      // Store homepage reference if this is a homepage generation
      if (categoryData?.title === "Simple Home Page" || categoryData?.title === "Landing Page Generator") {
        isExistedValue.homepageReference = aiGeneratedContent;
      }
      
      await isExistedValue.save();
      
      res.end();
    } catch (error) {
      console.error("Streaming error:", error);
      sendSSE({
        type: "error",
        message: error instanceof Error ? error.message : "Generation failed",
      });
      res.end();
    }
  }
);

export const generateContinuousProject = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const { 
      tasks, 
      blueprintId, 
      parallel = false, 
      maxConcurrent = 3 
    } = req.body as {
      tasks: Array<{
        title: string;
        category: string;
        values: { [key: string]: string };
      }>;
      blueprintId: string;
      parallel?: boolean;
      maxConcurrent?: number;
    };

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return next(createError("Tasks array is required and must not be empty", 400));
    }

    if (!blueprintId) {
      return next(createError("Blueprint ID is required", 400));
    }

    // Set up proper SSE headers for streaming
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control, Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "X-Accel-Buffering": "no",
    });

    // Helper function to send SSE data
    const sendSSE = (data: any) => {
      const sseData = `data: ${JSON.stringify(data)}\n\n`;
      res.write(sseData);
    };

    try {
      // Test streaming setup
      sendSSE({
        type: "test",
        message: "Continuous generation streaming test successful",
        timestamp: new Date().toISOString(),
      });

      // Stream initial progress
      sendSSE({
        type: "progress",
        message: "Preparing continuous generation...",
        progress: 5,
      });

      // Get blueprint values
      const blueprintValues = (
        (await CategoryValue.find({ blueprint: blueprintId })
          .populate("category")
          .lean()) as any[]
      ).map((blue) => ({ title: blue.category.title, values: blue.value }));

      // Stream blueprint values
      sendSSE({
        type: "data",
        key: "blueprintValues",
        value: blueprintValues,
        progress: 10,
      });

      // Prepare tasks for continuous generation
      const generationTasks = [];
      let totalWordCount = 0;

      for (const task of tasks) {
        const fieldValue = Object.keys(task.values).map((key) => {
          return {
            key: key?.split("-")[0] || "",
            value:
              typeof task.values[key] === "string"
                ? [task.values[key]]
                : task.values[key] || [""],
          };
        });

        // Get category data to determine main category
        const categoryData = await Category.findById(task.category).lean();
        let mainCategory = categoryData?.title || '';
        
        // Determine main category by finding the root category
        if (categoryData?.parentId) {
          let currentCategory = categoryData;
          while (currentCategory.parentId) {
            const parentCategory = await Category.findById(currentCategory.parentId).lean();
            if (parentCategory) {
              currentCategory = parentCategory;
            } else {
              break;
            }
          }
          mainCategory = currentCategory.title;
        }

        // Validate task
        const validation = continuousProjectGenerator.validateTask({
          title: task.title,
          blueprintValues,
          fieldValue,
          mainCategory
        });

        if (!validation.isValid) {
          sendSSE({
            type: "task_error",
            title: task.title,
            message: `Task validation failed: ${validation.errors.join(", ")}`,
          });
          continue;
        }

        generationTasks.push({
          title: task.title,
          blueprintValues,
          fieldValue,
          mainCategory,
        });
      }

      if (generationTasks.length === 0) {
        sendSSE({
          type: "error",
          message: "No valid tasks to generate",
        });
        return res.end();
      }

      // Stream progress update
      sendSSE({
        type: "progress",
        message: `Starting generation of ${generationTasks.length} tasks...`,
        progress: 20,
      });

      // Configure continuous generation
      const config = {
        tasks: generationTasks,
        parallel,
        maxConcurrent,
        onTaskStart: (task: any) => {
          sendSSE({
            type: "task_start",
            title: task.title,
            message: `Starting ${task.title}`,
          });
        },
        onTaskComplete: (task: any, result: string) => {
          sendSSE({
            type: "task_complete",
            title: task.title,
            message: `Completed ${task.title}`,
            content: result,
          });
        },
        onTaskError: (task: any, error: any) => {
          sendSSE({
            type: "task_error",
            title: task.title,
            message: `Error in ${task.title}: ${error}`,
          });
        },
        onProgress: (completed: number, total: number, currentTask?: string) => {
          const progress = Math.round((completed / total) * 80) + 20; // 20-100%
          sendSSE({
            type: "progress",
            message: currentTask ? `Processing ${currentTask}...` : "Processing tasks...",
            progress,
            completed,
            total,
          });
        },
      };

      // Execute continuous generation
      const results = await continuousProjectGenerator.generate(config, sendSSE);

      // Calculate total word count
      const successfulResults = results.filter(r => r.success && r.content);
      for (const result of successfulResults) {
        if (result.content) {
          const wordCount = result.content.split(/\s+/).length;
          totalWordCount += wordCount;
        }
      }

      // Update user word count
      try {
        const wordCountResult = await updateUserWordCount(req.user.id, totalWordCount.toString(), User);
        
        // Stream completion with word count info
        sendSSE({
          type: "complete",
          message: "Continuous project generation completed successfully",
          progress: 100,
          data: {
            success: true,
            results,
            wordCount: {
              wordsUsed: wordCountResult.wordsUsed,
              wordsLeft: wordCountResult.wordsLeft,
              wordsInContent: wordCountResult.wordsInContent || 0
            },
            summary: {
              total: results.length,
              successful: results.filter(r => r.success).length,
              failed: results.filter(r => !r.success).length,
              totalDuration: results.reduce((sum, r) => sum + r.duration, 0)
            }
          },
        });
      } catch (wordCountError) {
        console.error("Error updating word count:", wordCountError);
        // Still send completion but without word count
        sendSSE({
          type: "complete",
          message: "Continuous project generation completed successfully",
          progress: 100,
          data: {
            success: true,
            results,
            summary: {
              total: results.length,
              successful: results.filter(r => r.success).length,
              failed: results.filter(r => !r.success).length,
              totalDuration: results.reduce((sum, r) => sum + r.duration, 0)
            }
          },
        });
      }

      res.end();
    } catch (error) {
      console.error("Error in continuous project generation:", error);
      sendSSE({
        type: "error",
        message: `Continuous generation failed: ${error instanceof Error ? error.message : String(error)}`,
      });
      res.end();
    }
  }
);

export const getAvailableServices = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    try {
      const services = continuousProjectGenerator.getAvailableServices();
      const categories = continuousProjectGenerator.getCategories();
      
      const servicesByCategory: { [key: string]: string[] } = {};
      categories.forEach(category => {
        servicesByCategory[category] = continuousProjectGenerator.getServicesByCategory(category);
      });

      res.json({
        success: true,
        data: {
          services,
          categories,
          servicesByCategory
        }
      });
    } catch (error) {
      return next(createError(`Failed to get available services: ${error}`, 500));
    }
  }
);

export const singleProject = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const { id } = req.params;
    if (!id) {
      return next(createError("Project ID is required", 400));
    }

    // Try to find project by ObjectId first, then by name
    let project;
    if (mongoose.Types.ObjectId.isValid(id)) {
      // Try ObjectId lookup
      project = await Project.findOne({ _id: id, userId: req.user.id })
        .populate("categoryId")
        .populate("blueprintId", "_id title")
        .lean();
    }

    // If not found by ObjectId, try by name (URL decoded)
    if (!project) {
      const decodedName = decodeURIComponent(id);
      project = await Project.findOne({ 
        name: decodedName, 
        userId: req.user.id 
      })
        .populate("categoryId")
        .populate("blueprintId", "_id title")
        .lean();
    }

    if (!project) {
      return next(createError("Project not found", 404));
    }

    // Extract all category IDs for batch processing
    const rootCategoryIds = project.categoryId?.map((cat: any) => cat._id) || [];

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
        project: project._id,
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

    // Build the final response
    const responseData = {
      ...project,
      categoryId: buildCategoryTree(project.categoryId || []),
    };

    res.json({
      success: true,
      data: responseData,
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
