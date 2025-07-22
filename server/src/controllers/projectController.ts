import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { catchAsync, createError } from "../middleware/errorHandler";
import mongoose from "mongoose";

import { Category, IProject, Project } from "../models";
import { CategoryValue } from "../models/CategoryValue";
import { deepSeekService } from "../services/deepseek";

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

        const { category, project, values, blueprintId, currentCategory } = req.body as {
            category: string,
            project: string,
            values: { [key: string]: string },
            blueprintId: string,
            currentCategory: string
        };

        // Set up SSE headers
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

        try {
            // Stream initial progress
            res.write(JSON.stringify({
                type: 'progress',
                message: 'Processing field values...',
                progress: 10
            }) + '\n');

            const fieldValue = Object.keys(values).map((key) => {
                return { key: key?.split('-')[0], value: values[key] };
            });

            const categoryValue = new CategoryValue({
                category: currentCategory,
                project,
                value: fieldValue
            });
           

            // Stream progress update
            res.write(JSON.stringify({
                type: 'progress',
                message: 'Fetching blueprint values...',
                progress: 30
            }) + '\n');

            const blueprintValues = (await CategoryValue.find({ blueprint: blueprintId })
                .populate('category')
                .lean() as any[])
                .map(blue => ({ title: blue.category.title, values: blue.value }));

            // Stream blueprint values
            res.write(JSON.stringify({
                type: 'data',
                key: 'blueprintValues',
                value: blueprintValues,
                progress: 50
            }) + '\n');

            // Stream progress update
            res.write(JSON.stringify({
                type: 'progress',
                message: 'Generating AI content...',
                progress: 70
            }) + '\n');

            const categoryData = await Category.findById(category).lean();

            let aiGeneratedContent = '';
            console.log("categoryData",categoryData?.title)

            switch (categoryData?.title) {
                case "Email":
                    // Use streaming version with progress callback
                    aiGeneratedContent = await deepSeekService.generateEmailStream(
                        blueprintValues,
                        fieldValue,
                        (chunk: string) => {
                            // Stream AI content chunks as they arrive
                            res.write(JSON.stringify({
                                type: 'ai_chunk',
                                content: chunk,
                                progress: 85
                            }) + '\n');
                        }
                    );
                    break;
                case "Articles":
                    aiGeneratedContent = await deepSeekService.generateArticleStream(
                        blueprintValues,
                        fieldValue,
                        (chunk: string) => {
                            // Stream AI content chunks as they arrive
                            res.write(JSON.stringify({
                                type: 'ai_chunk',
                                content: chunk,
                                progress: 85
                            }) + '\n');
                        }
                    );
                    break;
                default:
                    break;
            }

            if (!aiGeneratedContent) {
                res.write(JSON.stringify({
                    type: 'error',
                    message: 'Failed to generate project'
                }) + '\n');
                return res.end();
            }

            // Stream final AI generated content
            res.write(JSON.stringify({
                type: 'data',
                key: 'aiContent',
                value: aiGeneratedContent,
                progress: 90
            }) + '\n');

            // Stream field values
            res.write(JSON.stringify({
                type: 'data',
                key: 'fieldValue',
                value: fieldValue,
                progress: 95
            }) + '\n');

            // Stream completion
            res.write(JSON.stringify({
                type: 'complete',
                message: 'Project generation completed successfully',
                progress: 100,
                data: {
                    success: true,
                    blueprintValues,
                    fieldValue,
                    aiContent: aiGeneratedContent
                }
            }) + '\n');

            categoryValue.isAiGeneratedContent = aiGeneratedContent;
            await categoryValue.save();
            res.status(200).json({
                success: true,
                data: {
                    success: true,
                    categoryValueId: categoryValue._id
                }
            })

            res.end();

        } catch (error: any) {
            console.log("error", error);
            res.write(JSON.stringify({
                type: 'error',
                message: error.message || 'An error occurred during generation'
            }) + '\n');
            res.end();
        }
    }
);

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
            .populate("categoryId").populate("blueprintId","_id title")
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

                const categoryValue = await CategoryValue.findOne({ category: category._id, project: id }).lean();

                // Build the category object with nested structure
                const categoryWithChildren = {
                    ...category,
                    subCategories: [],
                    fieldValue: categoryValue
                };

                // Process each subcategory
                for (const subCategory of subCategories) {
                    // Get third level categories for this subcategory
                    const thirdCategories = await Category.find({
                        parentId: subCategory._id,
                        type: "project"
                    }).lean();

                    const subCategoryValue = await CategoryValue.findOne({ category: subCategory._id, project: id }).lean();

                    // Process third-level categories and get their values
                    const thirdCategoriesWithValues = [];
                    for (const thirdCategory of thirdCategories) {
                        const thirdCategoryValue = await CategoryValue.findOne({ category: thirdCategory._id, project: id }).lean();
                        
                        thirdCategoriesWithValues.push({
                            ...thirdCategory,
                            fieldValue: thirdCategoryValue
                        });
                    }

                    // Add subcategory with its children
                    categoryWithChildren.subCategories.push({
                        ...subCategory,
                        thirdCategories: thirdCategoriesWithValues,
                        fieldValue: subCategoryValue
                    });
                }

                categoryTree.push(categoryWithChildren);
            }

            return categoryTree;
        };

        // Build the nested category structure
        const nestedCategories = await buildCategoryTree(project.categoryId);
        console.log('nestedCategories', project.categoryId)

        res.json({
            success: true,
            data: {
                ...project,
                categoryId: nestedCategories 
            }
        });
    }
);

export const allProject = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(createError("User not found in request", 401));
        }
        const projects = await Project.find({ userId: req.user.id })
            .populate("categoryId")
            .populate("blueprintId", "_id title")
            .sort({ createdAt: -1 })
            .lean() as any;

        if (!projects) {
            return next(createError("Project not found", 404));
        }

        res.json({
            success: true,
            data: projects
        });
    }
);

export const deleteProject = catchAsync(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(createError("User not found in request", 401));
        }
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return next(createError("Project not found", 404));
        }
        res.json({
            success: true,
            data: project
        });
    }
)