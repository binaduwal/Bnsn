import { AuthRequest } from "../middleware/auth";
import { catchAsync, createError } from "../middleware/errorHandler";
import { Blueprint } from "../models/Blueprint";
import { NextFunction, Response } from "express";
import { deepSeekService } from "../services/deepseek";
import mongoose, { ObjectId } from "mongoose";
import { Category } from "../models";
import { CategoryValue } from "../models/CategoryValue";

export const createBlueprint = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const { title, description, offerType } = req.body;

    const blueprint = new Blueprint({ title, description, offerType });
    await blueprint.save();

    const usedCategoryIds: mongoose.Schema.Types.ObjectId[] = [];

    try {
      const aiGeneratedContent = await deepSeekService.generateBlueprint(
        description,
        offerType
      );

      if (Array.isArray(aiGeneratedContent)) {
        for (const aiCategory of aiGeneratedContent) {
          const {
            title: categoryTitle,
            description: categoryDescription,
            fields,
          } = aiCategory;

          // Find or create Category
          let category = await Category.findOne({ title: categoryTitle });

          if (!category) {
            category = new Category({
              title: categoryTitle,
              description: categoryDescription,
              fields: fields.map((f: any) => ({
                fieldName: f.fieldName,
                fieldType: f.fieldType || "text",
              })),
            });
            await category.save();
          }

          usedCategoryIds.push(category._id as mongoose.Schema.Types.ObjectId);

          // Create CategoryValue document
          const categoryValue = new CategoryValue({
            category: category._id,
            blueprint: blueprint._id,
            value: fields.map((f: any) => ({
              key: f.fieldName,
              value: Array.isArray(f.value) ? f.value : [f.value],
            })),
          });

          await categoryValue.save();
        }
      } else {
        console.warn("Invalid AI response format for categories.");
      }
    } catch (aiError) {
      console.warn(
        "Error during AI content generation or processing:",
        aiError
      );
    }

    //Update blueprint with used category IDs
    blueprint.categories = usedCategoryIds as mongoose.Schema.Types.ObjectId[];
    await blueprint.save();

    res.status(201).json({
      success: true,
      data: blueprint,
    });
  }
);
