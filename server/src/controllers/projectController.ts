import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { catchAsync, createError } from "../middleware/errorHandler";
import mongoose from "mongoose";

import { Category, IProject, Project } from "../models";

export const createProject = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {

        if (!req.user) {
            return next(createError("User not found in request", 401));
        }



        const { name, description, blueprintId, categoryId } = req.body as {
            name: string;
            description: string;
            blueprintId: mongoose.Types.ObjectId;
            categoryId: mongoose.Types.ObjectId[];
        } || {}

        if (!name || !blueprintId || !categoryId || !categoryId.length) {
            return next(createError("Missing required fields", 400));
        }


        const alreadyExist = await Project.findOne({
            name,
            userId: req.user.id,
        });

        if (alreadyExist) {
            return next(createError("Project with same name already exists", 400));
        }

        const project = new Project({
            name,
            description,
            userId: (req.user as { id: string; email: string; role: string }).id,
            blueprintId,
            categoryId,
        });

        //save the projects
        await project.save();

        res.json({
            success: true,
            data: project

        });

    }
)


export const generateProject = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {

        if (!req.user) {
            return next(createError("User not found in request", 401));
        }

        const { projectId } = req.body as {
            projectId: mongoose.Types.ObjectId;
        };

        let values: { key: string, value: string }[] = [];

        // categoryValues.forEach(async (categoryId) => {
        //     if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        //         return next(createError("Invalid categoryId", 400));
        //     }

        //     const category = await CategoryValue.findById(categoryId);

        //     if (!category) {
        //         return next(createError("Category not found", 404));
        //     }

        //     values.push(...category.value)
        // });

        //summarize the values to give them to deepseek
        // const aiGeneratedContent = await deepSeekService.analyzeProject(
        //     description,
        // );

        // if (!aiGeneratedContent) {
        //     return next(createError("Failed to generate project", 500));
        // }


        //save the projects

        res.json({
            success: true,
        });

    }
)

export const singleProject = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(createError("User not found in request", 401));
        }

        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return next(createError("Invalid project ID", 400));
        }

        const project = await Project.findOne({ _id: id, userId: req.user.id })
            .populate("categoryId")
            .lean() as any;

        if (!project) {
            return next(createError("Project not found", 404));
        }

        // Build nested category structure
        const buildCategoryTree = async (categories: any[]) => {
            const categoryTree = [];

            for (const category of categories) {
                // Get subcategories for this category
                const subCategories = await Category.find({
                    parentId: category._id,
                    type: "project"
                }).lean();

                // Build the category object with nested structure
                const categoryWithChildren = {
                    ...category,
                    subCategories: []
                };

                // Process each subcategory
                for (const subCategory of subCategories) {
                    // Get third level categories for this subcategory
                    const thirdCategories = await Category.find({
                        parentId: subCategory._id,
                        type: "project"
                    }).lean();

                    // Add subcategory with its children
                    categoryWithChildren.subCategories.push({
                        ...subCategory,
                        thirdCategories: thirdCategories
                    });
                }

                categoryTree.push(categoryWithChildren);
            }

            return categoryTree;
        };

        // Build the nested category structure
        const nestedCategories = await buildCategoryTree(project.categoryId);

        res.json({
            success: true,
            data: {
                ...project,
                categoryId: nestedCategories // Replace flat categories with nested structure
            }
        });
    }
);