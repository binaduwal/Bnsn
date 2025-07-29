import { UserCategoryAlias, IUserCategoryAlias } from '../models/UserCategoryAlias';
import { Category, ICategory } from '../models/Category';

export class UserCategoryAliasService {
  /**
   * Get the effective alias for a category for a specific user and project
   * Returns custom alias if exists, otherwise returns the category's default alias
   */
  static async getEffectiveAlias(userId: string, projectId: string, categoryId: string): Promise<string> {
    try {
      // First check if user has a custom alias for this category in this project
      const userAlias = await UserCategoryAlias.findOne({
        userId,
        projectId,
        categoryId
      });

      if (userAlias) {
        return userAlias.customAlias;
      }

      // If no custom alias, get the category's default alias
      const category = await Category.findById(categoryId);
      return category?.alias || category?.title || '';
    } catch (error) {
      console.error('Error getting effective alias:', error);
      throw error;
    }
  }

  /**
   * Set a custom alias for a user-project-category combination
   */
  static async setCustomAlias(userId: string, projectId: string, categoryId: string, customAlias: string): Promise<IUserCategoryAlias> {
    try {
      // Validate that the category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      // Use upsert to either update existing or create new
      const userAlias = await UserCategoryAlias.findOneAndUpdate(
        { userId, projectId, categoryId },
        { customAlias },
        { upsert: true, new: true }
      );

      return userAlias;
    } catch (error) {
      console.error('Error setting custom alias:', error);
      throw error;
    }
  }

  /**
   * Remove a custom alias for a user-project-category combination
   */
  static async removeCustomAlias(userId: string, projectId: string, categoryId: string): Promise<boolean> {
    try {
      const result = await UserCategoryAlias.findOneAndDelete({ userId, projectId, categoryId });
      return !!result;
    } catch (error) {
      console.error('Error removing custom alias:', error);
      throw error;
    }
  }

  /**
   * Get all custom aliases for a user in a specific project
   */
  static async getUserCustomAliases(userId: string, projectId: string): Promise<IUserCategoryAlias[]> {
    try {
      return await UserCategoryAlias.find({ userId, projectId }).populate('categoryId');
    } catch (error) {
      console.error('Error getting user custom aliases:', error);
      throw error;
    }
  }

  /**
   * Get categories with effective aliases for a user in a specific project
   * This returns categories with their effective aliases (custom or default)
   */
  static async getCategoriesWithEffectiveAliases(userId: string, projectId: string, filter?: any): Promise<any[]> {
    try {
      const categories = await Category.find(filter || {});
      const userAliases = await UserCategoryAlias.find({ userId, projectId });
      
      // Create a map of categoryId to custom alias for quick lookup
      const aliasMap = new Map();
      userAliases.forEach(alias => {
        aliasMap.set(alias.categoryId.toString(), alias.customAlias);
      });

      // Add effective alias to each category
      return categories.map(category => {
        const categoryObj = category.toObject();
        return {
          ...categoryObj,
          effectiveAlias: aliasMap.get((categoryObj._id as string).toString()) || categoryObj.alias || categoryObj.title
        };
      });
    } catch (error) {
      console.error('Error getting categories with effective aliases:', error);
      throw error;
    }
  }
} 