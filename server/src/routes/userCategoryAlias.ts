import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { UserCategoryAliasService } from "../services/userCategoryAliasService";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get effective alias for a specific category in a project
router.get('/effective/:projectId/:categoryId', async (req: AuthRequest, res) => {
  try {
    const { projectId, categoryId } = req.params;
    const userId = req.user!.id;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    
    const effectiveAlias = await UserCategoryAliasService.getEffectiveAlias(userId, projectId, categoryId);
    
    return res.json({ effectiveAlias });
  } catch (error) {
    console.error('Error getting effective alias:', error);
    return res.status(500).json({ error: 'Failed to get effective alias' });
  }
});

// Set custom alias for a category in a project
router.post('/:projectId/:categoryId', async (req: AuthRequest, res) => {
  try {
    const { projectId, categoryId } = req.params;
    const { customAlias } = req.body;
    const userId = req.user!.id;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    
    if (!customAlias || typeof customAlias !== 'string') {
      return res.status(400).json({ error: 'Custom alias is required and must be a string' });
    }
    
    const userAlias = await UserCategoryAliasService.setCustomAlias(userId, projectId, categoryId, customAlias);
    
    return res.json({ success: true, userAlias });
  } catch (error) {
    console.error('Error setting custom alias:', error);
    return res.status(500).json({ error: 'Failed to set custom alias' });
  }
});

// Remove custom alias for a category in a project (revert to default)
router.delete('/:projectId/:categoryId', async (req: AuthRequest, res) => {
  try {
    const { projectId, categoryId } = req.params;
    const userId = req.user!.id;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    
    const removed = await UserCategoryAliasService.removeCustomAlias(userId, projectId, categoryId);
    
    return res.json({ success: true, removed });
  } catch (error) {
    console.error('Error removing custom alias:', error);
    return res.status(500).json({ error: 'Failed to remove custom alias' });
  }
});

// Get all custom aliases for the user in a project
router.get('/:projectId', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.id;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    const userAliases = await UserCategoryAliasService.getUserCustomAliases(userId, projectId);
    
    return res.json({ userAliases });
  } catch (error) {
    console.error('Error getting user custom aliases:', error);
    return res.status(500).json({ error: 'Failed to get user custom aliases' });
  }
});

// Get categories with effective aliases for the user in a project
router.get('/:projectId/categories/effective', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user!.id;
    const filter = req.query; // Allow filtering by query parameters
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    const categories = await UserCategoryAliasService.getCategoriesWithEffectiveAliases(userId, projectId, filter);
    
    return res.json({ categories });
  } catch (error) {
    console.error('Error getting categories with effective aliases:', error);
    return res.status(500).json({ error: 'Failed to get categories with effective aliases' });
  }
});

export default router; 