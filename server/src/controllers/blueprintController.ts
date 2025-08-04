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

    if (!title || !description || !offerType) {
      return next(createError("Missing required fields", 400));
    }

    const blueprint = await new Blueprint({
      title,
      description,
      offerType,
      userId: req.user.id,
    }).save();

    const allCategories = await Category.find({ type: "blueprint" });

    if (!allCategories.length) {
      return next(createError("No blueprint categories found", 404));
    }

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    try {
      const aiGeneratedContent = await deepSeekService.generateBlueprint(
        description,
        offerType,
        allCategories,
        (chunk: string) => {
          res.write(`data: ${JSON.stringify({ type: 'progress', content: chunk })}\n\n`);
        }
      );

      if (!Array.isArray(aiGeneratedContent) || !aiGeneratedContent.length) {
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'No AI content returned' })}\n\n`);
        res.end();
        return;
      }

      const categoryTitleMap = new Map(
        allCategories.map(cat => [cat.title, cat])
      );

      const categoryValueDocs = [];

      for (const aiCategory of aiGeneratedContent) {
        const { title: catTitle, fields } = aiCategory;
        const category = categoryTitleMap.get(catTitle);

        if (!category || !fields?.length) {
          continue;
        }

        blueprint.categories.push(category._id as ObjectId); // Push to array

        categoryValueDocs.push({
          category: category._id,
          blueprint: blueprint._id,
          userId: req.user.id,
          value: fields.map((f: any) => ({
            key: f.fieldName,
            value: f.value || '',
          })),
        });
      }

      // Bulk insert category values (much faster than individual saves)
      if (categoryValueDocs.length) {
        await CategoryValue.insertMany(categoryValueDocs);
      }

      // Save blueprint with category references
      await blueprint.save();

      const totalFields = categoryValueDocs.reduce((acc, curr) => acc + curr.value.length, 0);
      console.log(`Total fields processed: ${totalFields}`);

      res.write(`data: ${JSON.stringify({
        type: 'complete',
        data: blueprint,
        success: true,
      })}\n\n`);
      res.end();

    } catch (err) {
      console.error("AI Generation Error:", err);
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'AI generation failed' })}\n\n`);
      res.end();
    }
  }
);

export const getAllBlueprint = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const blueprints = await Blueprint.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean()

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


    // console.log('category values', categoryValues)

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