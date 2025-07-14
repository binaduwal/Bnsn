import { Router } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateBody, validateParams, validateQuery } from '../middleware/validation';
import { Campaign, Project, Blueprint } from '../models';
import { deepSeekService } from '../services/deepseek';
import { createError } from '../middleware/errorHandler';

const router = Router();

const createCampaignSchema = Joi.object({
  name: Joi.string().required().min(1).max(200),
  projectId: Joi.string().required(),
  content: Joi.string().optional().default(''),
});

const updateCampaignSchema = Joi.object({
  name: Joi.string().optional().min(1).max(200),
  content: Joi.string().optional(),
  status: Joi.string().valid('Draft', 'Sent', 'Scheduled').optional(),
});

const campaignParamsSchema = Joi.object({
  id: Joi.string().required(),
});

const campaignQuerySchema = Joi.object({
  projectId: Joi.string().optional(),
  status: Joi.string().valid('Draft', 'Sent', 'Scheduled').optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
});

const generateContentSchema = Joi.object({
  campaignType: Joi.string().optional().default('promotional'),
  includeBlueprint: Joi.boolean().optional().default(true),
});

router.get('/', authenticateToken, validateQuery(campaignQuerySchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { projectId, status, page = 1, limit = 20 } = req.query as any;

    const filter: any = { userId: req.user.id };

    if (projectId) {
      if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        return next(createError('Invalid project ID', 400));
      }
      filter.projectId = projectId;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [campaigns, total] = await Promise.all([
      Campaign.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Campaign.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        campaigns,
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

router.post('/', authenticateToken, validateBody(createCampaignSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { name, projectId, content } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return next(createError('Invalid project ID', 400));
    }

    const project = await Project.findOne({ _id: projectId, userId: req.user.id });
    if (!project) {
      return next(createError('Project not found', 404));
    }

    const campaign = new Campaign({
      name,
      projectId,
      content: content || '',
      status: 'Draft',
      userId: req.user.id,
      statistics: {
        wordsUsed: content ? content.split(' ').length : 0,
      },
    });

    await campaign.save();

    res.status(201).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, validateParams(campaignParamsSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid campaign ID', 400));
    }

    const campaign = await Campaign.findOne({ _id: id, userId: req.user.id }).lean();

    if (!campaign) {
      return next(createError('Campaign not found', 404));
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, validateParams(campaignParamsSchema), validateBody(updateCampaignSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid campaign ID', 400));
    }

    const updateData: any = { ...req.body };
    if (req.body.content) {
      updateData.statistics = {
        wordsUsed: req.body.content.split(' ').length,
      };
    }

    const updatedCampaign = await Campaign.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedCampaign) {
      return next(createError('Campaign not found', 404));
    }

    res.json({
      success: true,
      data: updatedCampaign,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, validateParams(campaignParamsSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid campaign ID', 400));
    }

    const deletedCampaign = await Campaign.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deletedCampaign) {
      return next(createError('Campaign not found', 404));
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/generate-content', authenticateToken, validateParams(campaignParamsSchema), validateBody(generateContentSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;
    const { campaignType, includeBlueprint } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid campaign ID', 400));
    }

    const campaign = await Campaign.findOne({ _id: id, userId: req.user.id });

    if (!campaign) {
      return next(createError('Campaign not found', 404));
    }

    const project = await Project.findOne({ _id: campaign.projectId, userId: req.user.id }).lean();
    if (!project) {
      return next(createError('Associated project not found', 404));
    }

    let blueprintData = null;
    if (includeBlueprint && project.blueprintId) {
      blueprintData = await Blueprint.findOne({ _id: project.blueprintId, userId: req.user.id }).lean();
    }

    const contextData = {
      project,
      blueprint: blueprintData,
      campaignType,
    };

    const generatedContent = await deepSeekService.generateEmailContent(contextData, campaignType);

    campaign.content = generatedContent;
    campaign.statistics = {
      ...campaign.statistics,
      wordsUsed: generatedContent.split(' ').length,
    };
    await campaign.save();

    res.json({
      success: true,
      data: {
        campaign,
        generatedContent,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/preview', authenticateToken, validateParams(campaignParamsSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid campaign ID', 400));
    }

    const campaign = await Campaign.findOne({ _id: id, userId: req.user.id }).lean();

    if (!campaign) {
      return next(createError('Campaign not found', 404));
    }

    const previewData = {
      subject: `Campaign: ${campaign.name}`,
      content: campaign.content,
      wordCount: campaign.content.split(' ').length,
      estimatedReadTime: Math.ceil(campaign.content.split(' ').length / 200),
    };

    res.json({
      success: true,
      data: previewData,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/stats', authenticateToken, validateParams(campaignParamsSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid campaign ID', 400));
    }

    const campaign = await Campaign.findOne({ _id: id, userId: req.user.id }).lean();

    if (!campaign) {
      return next(createError('Campaign not found', 404));
    }

    res.json({
      success: true,
      data: campaign.statistics || {
        wordsUsed: campaign.content.split(' ').length,
        emailsSent: 0,
        openRate: 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/send', authenticateToken, validateParams(campaignParamsSchema), async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return next(createError('User not found in request', 401));
    }

    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid campaign ID', 400));
    }

    const campaign = await Campaign.findOne({ _id: id, userId: req.user.id });

    if (!campaign) {
      return next(createError('Campaign not found', 404));
    }

    if (!campaign.content || campaign.content.trim().length === 0) {
      return next(createError('Campaign content is required before sending', 400));
    }

    campaign.status = 'Sent';
    campaign.statistics = {
      wordsUsed: campaign.statistics?.wordsUsed || 0,
      emailsSent: (campaign.statistics?.emailsSent || 0) + 1,
      openRate: campaign.statistics?.openRate || 0,
    };
    await campaign.save();

    res.json({
      success: true,
      data: campaign,
      message: 'Campaign sent successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;