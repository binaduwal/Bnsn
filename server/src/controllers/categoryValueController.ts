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