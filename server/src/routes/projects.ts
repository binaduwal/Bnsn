import { Router } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { Project } from '../models';
import { createError } from '../middleware/errorHandler';
import { createProject, generateProject, singleProject } from '../controllers/projectController';

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

router.get('/', authenticateToken, validateQuery(projectQuerySchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { search, status, type, page = 1, limit = 20 } = req.query as any;

    const filter: any = { userId: req.user.id };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, createProject);
router.post('/generate', authenticateToken, generateProject);



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

router.delete('/:id', authenticateToken, validateParams(projectParamsSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid project ID', 400));
    }

    const deletedProject = await Project.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deletedProject) {
      return next(createError('Project not found', 404));
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

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

router.post('/:id/duplicate', authenticateToken, validateParams(projectParamsSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid project ID', 400));
    }

    const project = await Project.findOne({ _id: id, userId: req.user.id }).lean();

    if (!project) {
      return next(createError('Project not found', 404));
    }

    const duplicatedProject = new Project({
      name: `${project.name} (Copy)`,
      type: project.type,
      status: 'Draft',
      userId: req.user.id,
      blueprintId: project.blueprintId,
      isStarred: false,
      settings: project.settings,
    });

    await duplicatedProject.save();

    res.status(201).json({
      success: true,
      data: duplicatedProject,
    });
  } catch (error) {
    next(error);
  }
});

export default router;