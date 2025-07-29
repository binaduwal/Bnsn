import { Router } from 'express';
import Joi from 'joi';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateQuery } from '../middleware/validation';
import { ActivityService } from '../services/activityService';
import { createError } from '../middleware/errorHandler';

const router = Router();

const activitiesQuerySchema = Joi.object({
  limit: Joi.number().min(1).max(50).default(10),
  type: Joi.string().optional(),
});

/**
 * GET /activities - Get user's recent activities
 */
router.get('/', authenticateToken, validateQuery(activitiesQuerySchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { limit = 10, type } = req.query;
    
    let activities;
    if (type) {
      // Filter by activity type
      activities = await ActivityService.getUserActivities(req.user.id, Number(limit));
      activities = activities.filter(activity => activity.type === type);
    } else {
      // Get all recent activities
      activities = await ActivityService.getUserActivities(req.user.id, Number(limit));
    }

    res.json({
      success: true,
      data: activities,
      count: activities.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /activities/types - Get available activity types
 */
router.get('/types', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const activityTypes = [
      'project_created',
      'project_updated', 
      'project_starred',
      'project_deleted',
      'blueprint_created',
      'blueprint_updated',
      'blueprint_starred',
      'blueprint_deleted',
      'project_generated',
      'blueprint_cloned'
    ];

    res.json({
      success: true,
      data: activityTypes
    });
  } catch (error) {
    next(error);
  }
});

export default router; 