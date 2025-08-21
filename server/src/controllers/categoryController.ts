import {
  catchAsync,
  createError,
  errorHandler,
} from "../middleware/errorHandler";
import { Request, Response } from "express";
import { Category } from "../models";
import { AuthRequest } from "../middleware/auth";
import { UserCategoryAliasService } from "../services/userCategoryAliasService";

export const createCategory = catchAsync(
  async (req: Request, res: Response, next: any) => {
    const { title, alias, description, fields, settings, parentId, type } = req.body;

    // Check for duplicate title within same parent scope
    const duplicateTitle = await Category.findOne({ title, parentId });
    if (duplicateTitle) {
      return next(createError("Category with this title already exists under the selected parent", 400));
    }

    // Check for duplicate alias within same parent scope
    const duplicateAlias = await Category.findOne({ alias, parentId });
    if (duplicateAlias) {
      return next(createError("Category with this alias already exists under the selected parent", 400));
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
      alias: alias || title, // Use title as default if alias not provided
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

export const updateCategory = catchAsync(
  async (req: Request, res: Response, next: any) => {
    const { id } = req.params;
    const { title, alias, description, fields, settings, parentId, type } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return next(createError("Category not found", 404));
    }

    // Check for duplicate title within same parent scope (excluding current category)
    if (title && title !== category.title) {
      const duplicateTitle = await Category.findOne({ title, parentId: parentId || category.parentId, _id: { $ne: id } });
      if (duplicateTitle) {
        return next(createError("Category with this title already exists under the selected parent", 400));
      }
    }

    // Check for duplicate alias within same parent scope (excluding current category)
    if (alias && alias !== category.alias) {
      const duplicateAlias = await Category.findOne({ alias, parentId: parentId || category.parentId, _id: { $ne: id } });
      if (duplicateAlias) {
        return next(createError("Category with this alias already exists under the selected parent", 400));
      }
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        title: title || category.title,
        alias: alias || category.alias,
        description: description || category.description,
        fields: fields || category.fields,
        settings: settings || category.settings,
        parentId: parentId !== undefined ? parentId : category.parentId,
        type: type || category.type,
      },
      { new: true }
    );

    res.status(200).json(updatedCategory);
  }
);

export const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: any) => {
    const { type, level, projectId } = req.query;

    if (!type) {
      return next(createError("Category Type is  required", 400));
    }

    // Check if user is authenticated (has user property)
    const authReq = req as AuthRequest;
    if (authReq.user && projectId) {
      // User is authenticated and projectId is provided, get categories with effective aliases
      const filter: any = { type, level };
      const categories = await UserCategoryAliasService.getCategoriesWithEffectiveAliases(authReq.user.id, projectId as string, filter);
      res.status(200).json({ success: true, data: categories });
    } else {
      // No user authentication or no projectId, return categories with default aliases
      const categories = await Category.find({ type, level }).lean();
      res.status(200).json({ success: true, data: categories });
    }
  }
);
