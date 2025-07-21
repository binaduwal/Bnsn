import { NextFunction, Response } from "express";
import { catchAsync, createError } from "../middleware/errorHandler";
import { AuthRequest } from "../middleware/auth";
import { CategoryValue } from "../models/CategoryValue";

export const createCategoryValue = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(createError("User not found in request", 401));
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
    const { value } = req.body;

    if (!id) {
        return next(createError("Category value ID is required", 400));
    }

    if (!value || !Array.isArray(value)) {
        return next(createError("Value array is required", 400));
    }

    const updatedCategoryValue = await CategoryValue.findByIdAndUpdate(
        id,
        { value },
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