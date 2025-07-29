import { Router } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { Project } from '../models';
import { createError } from '../middleware/errorHandler';
import {
  allProject,
  createProject,
  deleteProject,
  generateProject,
  generateContinuousProject,
  getAvailableServices,
  singleProject,
  updateProjectCategory
} from '../controllers/projectController';

const router = Router();

const createProjectSchema = Joi.object({
  title: Joi.string().required().min(1).max(200),
  mode: Joi.string().valid('create', 'select').required(),
  blueprintId: Joi.string().optional(),
  details: Joi.string().optional().max(2000),
  offerType: Joi.string().optional().max(100),
  type: Joi.string().valid('project', 'blueprint').default('project'),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().optional().min(1).max(200),
  status: Joi.string().valid('Active', 'Draft', 'Archived').optional(),
  isStarred: Joi.boolean().optional(),
  settings: Joi.object({
    focus: Joi.string().optional(),
    tone: Joi.string().optional(),
    quantity: Joi.string().optional(),
  }).optional(),
});

const projectParamsSchema = Joi.object({
  id: Joi.string().required(),
});

const projectQuerySchema = Joi.object({
  search: Joi.string().optional(),
  status: Joi.string().valid('Active', 'Draft', 'Archived').optional(),
  type: Joi.string().valid('project', 'blueprint').optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
});

const continuousGenerationSchema = Joi.object({
  tasks: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      category: Joi.string().required(),
      values: Joi.object().required(),
    })
  ).min(1).required(),
  blueprintId: Joi.string().required(),
  parallel: Joi.boolean().default(false),
  maxConcurrent: Joi.number().min(1).max(10).default(3),
});

router.get('/', authenticateToken, allProject);

router.post('/', authenticateToken, createProject);
router.post('/generate', authenticateToken, generateProject);
router.post('/generate-continuous', authenticateToken, validateBody(continuousGenerationSchema), generateContinuousProject);
router.get('/services', authenticateToken, getAvailableServices);
router.post('/update-category/:id', authenticateToken, updateProjectCategory);

router.get('/:id', authenticateToken, validateParams(projectParamsSchema), singleProject);

router.put('/:id', authenticateToken, validateParams(projectParamsSchema), validateBody(updateProjectSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid project ID', 400));
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProject) {
      return next(createError('Project not found', 404));
    }

    res.json({
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, deleteProject);

router.put('/:id/star', authenticateToken, validateParams(projectParamsSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid project ID', 400));
    }

    const project = await Project.findOne({ _id: id, userId: req.user.id });

    if (!project) {
      return next(createError('Project not found', 404));
    }

    project.isStarred = !project.isStarred;
    await project.save();

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});



export default router;