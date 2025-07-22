import { AuthRequest } from "../middleware/auth";
import { catchAsync, createError } from "../middleware/errorHandler";
import { Blueprint } from "../models/Blueprint";
import { NextFunction, Response } from "express";
import { deepSeekService } from "../services/deepseek";
import mongoose from "mongoose";
import { Category } from "../models";
import { CategoryValue } from "../models/CategoryValue";

export const createBlueprint = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const { title, description, offerType } = req.body;

    // Validate required fields
    if (!title || !description || !offerType) {
      return next(createError("Missing required fields", 400));
    }

    const blueprint = new Blueprint({ title, description, offerType });
    await blueprint.save(); // Save blueprint first to get ID

    const usedCategoryIds: mongoose.Schema.Types.ObjectId[] = [];
    const allCategories = await Category.find({ type: "blueprint" });

    if (allCategories.length === 0) {
      return next(createError("No blueprint categories found", 404));
    }

    try {
      const aiGeneratedContent = await deepSeekService.generateBlueprint(
        description,
        offerType,
        allCategories
      );

      console.log("AI Generated Content:", JSON.stringify(aiGeneratedContent));


      if (Array.isArray(aiGeneratedContent) && aiGeneratedContent.length > 0) {
        for (const aiCategory of aiGeneratedContent) {
          const {
            title: categoryTitle,
            description: categoryDescription,
            fields,
          } = aiCategory;

          // Find existing category (don't create new ones)
          const category = await Category.findOne({
            title: categoryTitle,
            type: "blueprint"
          });

          if (!category) {
            console.warn(`Category not found: ${categoryTitle}`);
            continue;
          }

          usedCategoryIds.push(category._id as mongoose.Schema.Types.ObjectId);

          // Create CategoryValue document
          const categoryValue = new CategoryValue({
            category: category._id,
            blueprint: blueprint._id,
            value: fields.map((f: any) => ({
              key: f.fieldName,
              value: f.value || '', // Handle undefined values
            })),
          });

          await categoryValue.save();
        }
      } else {
        console.warn("Invalid or empty AI response format for categories.");
      }
    } catch (aiError) {
      console.error("Error during AI content generation:", aiError);
      // Continue with empty categories rather than failing
    }

    // Update blueprint with used category IDs
    blueprint.categories = usedCategoryIds;
    await blueprint.save();

    res.status(201).json({
      success: true,
      data: blueprint,
    });
  }
);
export const getAllBlueprint = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const blueprints = await Blueprint.find().sort({ createdAt: -1 }).lean()

    if (!blueprints) {
      return next(createError("No blueprints found", 404))
    }

    res.status(200).json({
      success: true,
      data: blueprints
    })

  })
export const getSingleBlueprint = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }
    const { id } = req.params
    const blueprints = await Blueprint.findOne({ _id: id }).populate('categories').lean() as any
    if (!blueprints) {
      return next(createError("No blueprint found", 404))
    }

    console.log('blueprint category', blueprints.categories)


    const categoryValues: any[] = []

    for (const category of blueprints.categories) {
      const categoryData = await CategoryValue.findOne({ blueprint: blueprints._id, category: category._id }).lean()
      console.log('category data', categoryData)
      categoryValues.push(categoryData)
    }

    if (!blueprints) {
      return next(createError("No blueprint found", 404))
    }
    console.log('category values', categoryValues)

    res.status(200).json({
      success: true,
      data: blueprints,
      categoryValues
    })

  })

export const deleteBlueprint = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }
    const { id } = req.params
    const blueprint = await Blueprint.findByIdAndDelete(id)
    if (!blueprint) {
      return next(createError("Blueprint not found", 404))
    }
    res.status(200).json({
      success: true,
      data: blueprint
    })
  }
)