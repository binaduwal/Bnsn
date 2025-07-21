import { Router } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation";
import { Category as Blueprint } from "../models";
import { createError } from "../middleware/errorHandler";
import { createBlueprint, deleteBlueprint, getAllBlueprint, getSingleBlueprint } from "../controllers/blueprintController";

const router = Router();

const createBlueprintSchema = Joi.object({
  title: Joi.string().required().min(1).max(200),
  description: Joi.string().required().min(10).max(5000),
  offerType: Joi.string().required().min(2).max(100),
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
