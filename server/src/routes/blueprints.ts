import { Router } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation";
import { Blueprint } from "../models/Blueprint";
import { Category } from "../models";
import { CategoryValue } from "../models/CategoryValue";
import { createError } from "../middleware/errorHandler";
import { createBlueprint, deleteBlueprint, getAllBlueprint, getSingleBlueprint } from "../controllers/blueprintController";
import { deepSeekService } from "../services/deepseek";
import { ActivityService } from "../services/activityService";

const router = Router();

const createBlueprintSchema = Joi.object({
  title: Joi.string().required().min(1).max(200),
  description: Joi.string().required().min(10).max(5000),
  offerType: Joi.string().required().min(2).max(100),
});

const cloneBlueprintSchema = Joi.object({
  userCopy: Joi.string().required().min(1).max(10000),
  customTitle: Joi.string().optional().min(1).max(200),
});

const updateBlueprintSchema = Joi.object({
  name: Joi.string().optional().min(1).max(200),
  feedBnsn: Joi.string().optional().min(10).max(5000),
  offerType: Joi.string().optional().min(2).max(100),
  formData: Joi.object({
    projectTitle: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    position: Joi.string().optional(),
    bioPosition: Joi.string().optional(),
    backstory: Joi.string().optional(),
    timeActive: Joi.string().optional(),
    credentials: Joi.array().items(Joi.string()).optional(),
    beforeStates: Joi.array().items(Joi.string()).optional(),
    afterStates: Joi.array().items(Joi.string()).optional(),
    offers: Joi.array().items(Joi.string()).optional(),
    pages: Joi.array().items(Joi.string()).optional(),
    miscellaneous: Joi.array().items(Joi.string()).optional(),
    training: Joi.array().items(Joi.string()).optional(),
    bookBuilder: Joi.array().items(Joi.string()).optional(),
    custom: Joi.array().items(Joi.string()).optional(),
    buyers: Joi.array().items(Joi.string()).optional(),
    company: Joi.array().items(Joi.string()).optional(),
  }).optional(),
});

const blueprintParamsSchema = Joi.object({
  id: Joi.string().required(),
});

const blueprintQuerySchema = Joi.object({
  search: Joi.string().optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
});

router.get(
  "/",
  authenticateToken,
  validateQuery(blueprintQuerySchema),
  getAllBlueprint
);

router.post(
  "/",
  authenticateToken,
  validateBody(createBlueprintSchema),
  createBlueprint
);

router.get(
  "/:id",
  authenticateToken,
  validateParams(blueprintParamsSchema),
  getSingleBlueprint
);
router.delete(
  "/:id",
  authenticateToken,

  deleteBlueprint
);
router.put(
  "/:id",
  authenticateToken,
  validateParams(blueprintParamsSchema),
  validateBody(updateBlueprintSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user) {
        return next(createError("User not found in request", 401));
      }

      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Invalid blueprint ID", 400));
      }

      const updatedBlueprint = await Blueprint.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        req.body,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedBlueprint) {
        return next(createError("Blueprint not found", 404));
      }

      res.json({
        success: true,
        data: updatedBlueprint,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  validateParams(blueprintParamsSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user) {
        return next(createError("User not found in request", 401));
      }

      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Invalid blueprint ID", 400));
      }

      const deletedBlueprint = await Blueprint.findOneAndDelete({
        _id: id,
        userId: req.user.id,
      });

      if (!deletedBlueprint) {
        return next(createError("Blueprint not found", 404));
      }

      res.json({
        success: true,
        message: "Blueprint deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put("/:id/star", authenticateToken, validateParams(blueprintParamsSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError("Invalid blueprint ID", 400));
    }

    const blueprint = await Blueprint.findOne({ _id: id, userId: req.user.id });

    if (!blueprint) {
      return next(createError("Blueprint not found", 404));
    }

    const wasStarred = blueprint.isStarred;
    blueprint.isStarred = !blueprint.isStarred;
    await blueprint.save();

    // Log activity
    await ActivityService.logBlueprintStarred(req.user.id, blueprint.title, blueprint._id as string, blueprint.isStarred);

    res.json({
      success: true,
      data: blueprint,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/clone", authenticateToken, validateParams(blueprintParamsSchema), validateBody(cloneBlueprintSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError("User not found in request", 401));
    }

    const { id } = req.params;
    const { userCopy, customTitle } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError("Invalid blueprint ID", 400));
    }

    // Find the original blueprint
    const originalBlueprint = await Blueprint.findOne({
      _id: id,
      userId: req.user.id,
    }).lean();

    if (!originalBlueprint) {
      return next(createError("Blueprint not found", 404));
    }

    // Create the cloned blueprint first
    const clonedBlueprint = new Blueprint({
      title: customTitle || `Cloned: ${originalBlueprint.title}`,
      description: `Cloned from ${originalBlueprint.title} with custom modifications.\n\nUser's Copy:\n${userCopy}\n\nOriginal Blueprint: ${originalBlueprint.title}\nCloned at: ${new Date().toLocaleString()}`,
      offerType: originalBlueprint.offerType,
      categories: originalBlueprint.categories || [],
      userId: req.user.id,
      isStarred: false,
    });

    await clonedBlueprint.save();

    // Set up SSE headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    try {
      // Get all blueprint categories
      const allCategories = await Category.find({ type: "blueprint" });

      if (allCategories.length === 0) {
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'No blueprint categories found' })}\n\n`);
        res.end();
        return;
      }

      // Use DeepSeek to process the user's copy and generate enhanced content
      const aiGeneratedContent = await deepSeekService.generateBlueprint(
        userCopy, // Use user's copy instead of original description
        originalBlueprint.offerType,
        allCategories,
        (chunk: string) => {
          // Send progress chunk to client
          res.write(`data: ${JSON.stringify({ type: 'progress', content: chunk })}\n\n`);
        }
      );

      console.log("AI Generated Content for Clone:", JSON.stringify(aiGeneratedContent, null, 2));

      if (!aiGeneratedContent) {
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'DeepSeek API is unreachable' })}\n\n`);
        res.end();
        return;
      }

      if (Array.isArray(aiGeneratedContent) && aiGeneratedContent.length > 0) {
        console.log(`Processing ${aiGeneratedContent.length} categories for clone...`);

        const usedCategoryIds: mongoose.Schema.Types.ObjectId[] = [];

        for (const aiCategory of aiGeneratedContent) {
          const {
            title: categoryTitle,
            description: categoryDescription,
            fields,
          } = aiCategory;

          console.log(`Processing category: ${categoryTitle} with ${fields?.length || 0} fields`);

          // Find existing category
          const category = await Category.findOne({
            title: categoryTitle,
            type: "blueprint"
          });

          if (!category) {
            console.warn(`Category not found: ${categoryTitle}`);
            continue;
          }

          usedCategoryIds.push(category._id as mongoose.Schema.Types.ObjectId);

          // Create CategoryValue document for the cloned blueprint
          const categoryValue = new CategoryValue({
            category: category._id,
            blueprint: clonedBlueprint._id,
            userId: req.user.id,
            value: fields.map((f: any) => ({
              key: f.fieldName,
              value: f.value || '',
            })),
          });

          console.log(`Saving category value for ${categoryTitle} with ${fields.length} fields`);
          await categoryValue.save();
        }

        // Update cloned blueprint with used category IDs
        clonedBlueprint.categories = usedCategoryIds;
        await clonedBlueprint.save();

        // Count total fields with data
        let totalFieldsWithData = 0;
        for (const aiCategory of aiGeneratedContent || []) {
          if (aiCategory.fields && Array.isArray(aiCategory.fields)) {
            totalFieldsWithData += aiCategory.fields.length;
          }
        }
        console.log(`Total fields with data for clone: ${totalFieldsWithData}`);
        console.log(`=====================================\n`);

        // Send final success response
        res.write(`data: ${JSON.stringify({
          type: 'complete',
          data: clonedBlueprint,
          success: true
        })}\n\n`);
        res.end();

      } else {
        console.warn("Invalid or empty AI response format for clone categories.");
        console.log("AI Response:", aiGeneratedContent);
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'Invalid AI response format' })}\n\n`);
        res.end();
      }

    } catch (aiError) {
      console.error("Error during AI content generation for clone:", aiError);
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: 'Error during AI content generation'
      })}\n\n`);
      res.end();
    }
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/duplicate",
  authenticateToken,
  validateParams(blueprintParamsSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user) {
        return next(createError("User not found in request", 401));
      }

      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Invalid blueprint ID", 400));
      }

      const blueprint = await Blueprint.findOne({
        _id: id,
        userId: req.user.id,
      }).lean();

      if (!blueprint) {
        return next(createError("Blueprint not found", 404));
      }

      const duplicatedBlueprint = new Blueprint({
        name: `${blueprint.title} (Copy)`,
        // feedBnsn: blueprint.feedBnsn,
        // offerType: blueprint.offerType,
        // formData: blueprint.formData,
        userId: req.user.id,
      });

      await duplicatedBlueprint.save();

      res.status(201).json({
        success: true,
        data: duplicatedBlueprint,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id/form-data",
  authenticateToken,
  validateParams(blueprintParamsSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user) {
        return next(createError("User not found in request", 401));
      }

      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return next(createError("Invalid blueprint ID", 400));
      }

      const blueprint = await Blueprint.findOne({
        _id: id,
        userId: req.user.id,
      });

      if (!blueprint) {
        return next(createError("Blueprint not found", 404));
      }

      // blueprint.formData = { ...blueprint.formData, ...req.body };
      await blueprint.save();

      res.json({
        success: true,
        data: blueprint,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
