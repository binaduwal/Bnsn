import {
  catchAsync,
  createError,
  errorHandler,
} from "../middleware/errorHandler";
import { Request, Response } from "express";
import { Category } from "../models";

export const createCategory = catchAsync(
  async (req: Request, res: Response, next: any) => {
    const { title, description, fields } = req.body;
    const existingCategory = await Category.findOne({ title });
    if (existingCategory) {
      return next(createError("Category already exists", 400));
    }
    const category = new Category({ title, description, fields });
    await category.save();
    res.status(201).json(category);
  }
);
