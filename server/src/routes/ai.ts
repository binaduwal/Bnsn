import { Router } from 'express';
import Joi from 'joi';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { deepSeekService } from '../services/deepseek';

const router = Router();

const generateBlueprintSchema = Joi.object({
  feedBnsn: Joi.string().required().min(10).max(5000),
  offerType: Joi.string().required().min(2).max(100),
});



router.post('/generate-blueprint',
  authenticateToken,
  validateBody(generateBlueprintSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const { feedBnsn, offerType } = req.body;

      const blueprint = await deepSeekService.generateBlueprint(feedBnsn, offerType, []);

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









export default router;