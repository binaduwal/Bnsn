import { Router } from 'express';
import Joi from 'joi';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { deepSeekService } from '../services/deepseek';
import { createError } from '../middleware/errorHandler';

const router = Router();

const generateBlueprintSchema = Joi.object({
  feedBnsn: Joi.string().required().min(10).max(5000),
  offerType: Joi.string().required().min(2).max(100),
});

const generateEmailSchema = Joi.object({
  blueprint: Joi.object().required(),
  campaignType: Joi.string().optional().default('promotional'),
});

const cloneCopySchema = Joi.object({
  originalText: Joi.string().required().min(10).max(10000),
  blueprint: Joi.string().required().min(10).max(5000),
  maxWords: Joi.number().optional().min(100).max(5000).default(2500),
});

const suggestImprovementsSchema = Joi.object({
  content: Joi.string().required().min(10).max(10000),
  context: Joi.string().required().min(10).max(2000),
});

const analyzeProjectSchema = Joi.object({
  projectData: Joi.object().required(),
});

router.post('/generate-blueprint', 
  authenticateToken, 
  validateBody(generateBlueprintSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { feedBnsn, offerType } = req.body;

      const blueprint = await deepSeekService.generateBlueprint(feedBnsn, offerType);

      res.json({
        success: true,
        data: {
          blueprint,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/generate-email-content',
  authenticateToken,
  validateBody(generateEmailSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { blueprint, campaignType } = req.body;

      const emailContent = await deepSeekService.generateEmailContent(blueprint, campaignType);

      res.json({
        success: true,
        data: {
          emailContent,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/clone-copy',
  authenticateToken,
  validateBody(cloneCopySchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { originalText, blueprint, maxWords } = req.body;

      const clonedCopy = await deepSeekService.cloneCopy(originalText, blueprint, maxWords);

      res.json({
        success: true,
        data: {
          clonedCopy,
          originalWordCount: originalText.split(' ').length,
          clonedWordCount: clonedCopy.split(' ').length,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/suggest-improvements',
  authenticateToken,
  validateBody(suggestImprovementsSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { content, context } = req.body;

      const suggestions = await deepSeekService.suggestImprovements(content, context);

      res.json({
        success: true,
        data: {
          suggestions,
          originalWordCount: content.split(' ').length,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/analyze-project',
  authenticateToken,
  validateBody(analyzeProjectSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { projectData } = req.body;

      const analysis = await deepSeekService.analyzeProject(projectData);

      res.json({
        success: true,
        data: {
          analysis,
          generatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;