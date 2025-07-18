import {
  catchAsync,
  createError,
  errorHandler,
} from "../middleware/errorHandler";
import { Request, Response } from "express";
import { Category } from "../models";

export const createCategory = catchAsync(
  async (req: Request, res: Response, next: any) => {
    const { title, description, fields, settings, parentId, type } = req.body;

    // Check for duplicate title within same parent scope
    const duplicateCategory = await Category.findOne({ title, parentId });
    if (duplicateCategory) {
      return next(createError("Category with this title already exists under the selected parent", 400));
    }

    let level = 0;

    // If parentId is provided, fetch the parent to determine the level
    if (parentId) {
      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return next(createError("Parent category not found", 404));
      }
      level = parentCategory.level + 1;
    }

    const category = new Category({
      title,
      description,
      fields,
      settings,
      parentId: parentId || null,
      type,
      level,
    });

    await category.save();
    res.status(201).json(category);
  }
);

export const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: any) => {
    const { type, level } = req.query;

    if (!type) {
      return next(createError("Category Type is  required", 400));
    }

    const categories = await Category.find({ type, level }).lean();

    res.status(201).json({ success: true, data: categories });
  }
);
