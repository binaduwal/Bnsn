import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { catchAsync, createError } from "../middleware/errorHandler";
import mongoose from "mongoose";
import { deepSeekService } from "../services/deepseek";
import { CategoryValue } from "../models/CategoryValue";

export const createProject = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {

        if (!req.user) {
            return next(createError("User not found in request", 401));
        }

        const { name, description, status, isStarred, blueprintId, categoryValues } = req.body as {
            name: string;
            description: string;
            status: string;
            isStarred: boolean;
            blueprintId: mongoose.Types.ObjectId;
            categoryValues: mongoose.Types.ObjectId[];
        };

        let values: { key: string, value: string }[] = [];

        categoryValues.forEach(async (categoryId) => {
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return next(createError("Invalid categoryId", 400));
            }

            const category = await CategoryValue.findById(categoryId);

            if (!category) {
                return next(createError("Category not found", 404));
            }

            values.push(...category.value)
        });

        //summarize the values to give them to deepseek
        const aiGeneratedContent = await deepSeekService.analyzeProject(
            description,
        );

        if (!aiGeneratedContent) {
            return next(createError("Failed to generate project", 500));
        }


        //save the projects

        res.json({
            success: true,
        });

    }
)
