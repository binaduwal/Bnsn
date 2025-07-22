import { NextFunction, Response } from "express";
import { catchAsync, createError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { CategoryValue } from "../models/CategoryValue";

export const updateAiContentValue = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError("User not found in request", 401));
    }

    const { id } = req.params;
    const { isAiGeneratedContent } = req.body;

    if (!id) {
        return next(createError("Category value ID is required", 400));
    }

    const categoryValue = await CategoryValue.findByIdAndUpdate(id, { isAiGeneratedContent }, { new: true });

    if (!categoryValue) {
        return next(createError("Category value not found", 404));
    }
    res.status(200).json({
        success: true,
    })
})

export const updateCategoryValue = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError("User not found in request", 401));
    }

    const { id } = req.params;
    const { value, isAiGeneratedContent } = req.body;

    if (!id) {
        return next(createError("Category value ID is required", 400));
    }

    if (!value || !Array.isArray(value)) {
        return next(createError("Value array is required", 400));
    }

    const updatedCategoryValue = await CategoryValue.findByIdAndUpdate(
        id,
        { value, isAiGeneratedContent },
        { new: true, runValidators: true }
    );

    if (!updatedCategoryValue) {
        return next(createError("Category value not found", 404));
    }

    res.status(200).json({
        success: true,
        data: updatedCategoryValue,
    });
});