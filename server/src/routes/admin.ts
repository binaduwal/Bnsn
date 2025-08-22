import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Project } from '../models/Project';
import { Blueprint } from '../models/Blueprint';
import { Activity } from '../models/Activity';
import { auth } from '../middleware/auth';
import { isAdmin } from '../middleware/auth';

const router = express.Router();

// Middleware to check if user is admin
const adminAuth = [auth, isAdmin];

// Dashboard Statistics
router.get('/dashboard/stats', adminAuth, async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalBlueprints = await Blueprint.countDocuments();
    const totalActivities = await Activity.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayActivities = await Activity.countDocuments({
      timestamp: { $gte: today }
    });

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) }
    });

    // Active users this month (users who have created projects or blueprints)
    const activeUsersThisMonth = await User.countDocuments({
      $or: [
        { 
          _id: { 
            $in: await Project.distinct('userId', {
              createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) }
            })
          }
        },
        { 
          _id: { 
            $in: await Blueprint.distinct('userId', {
              createdAt: { $gte: new Date(today.getFullYear(), today.getMonth(), 1) }
            })
          }
        }
      ]
    });

    // Calculate average words per user
    const usersWithWords = await User.aggregate([
      {
        $group: {
          _id: null,
          totalWordsUsed: { $sum: '$wordsUsed' },
          userCount: { $sum: 1 }
        }
      }
    ]);

    const averageWordsPerUser = usersWithWords.length > 0 
      ? Math.round(usersWithWords[0].totalWordsUsed / usersWithWords[0].userCount)
      : 0;

    res.json({
      totalUsers,
      totalProjects,
      totalBlueprints,
      totalActivities,
      todayActivities,
      newUsersThisMonth,
      activeUsersThisMonth,
      averageWordsPerUser
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

// User Management
router.get('/users', adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const search = req.query.search as string || '';
    
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPages = Math.ceil(totalUsers / limit);
    
    res.json({
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalUsers,
        itemsPerPage: limit
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

router.put('/users/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, totalWords } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, role, totalWords },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

router.delete('/users/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Category Management
router.get('/categories', adminAuth, async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string || '';
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { alias: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get all categories for tree structure
    const allCategories = await Category.find(query)
      .sort({ level: 1, title: 1 })
      .lean();
    
    // Build tree structure
    const buildCategoryTree = (categories: any[]) => {
      const categoryMap = new Map();
      const rootCategories: any[] = [];

      // First pass: create a map of all categories
      categories.forEach(category => {
        categoryMap.set(category._id.toString(), { ...category, children: [] });
      });

      // Second pass: build the tree structure
      categories.forEach(category => {
        const categoryWithChildren = categoryMap.get(category._id.toString());
        
        if (category.parentId && categoryMap.has(category.parentId.toString())) {
          const parent = categoryMap.get(category.parentId.toString());
          parent.children.push(categoryWithChildren);
        } else {
          rootCategories.push(categoryWithChildren);
        }
      });

      // Sort categories by level and title
      const sortCategories = (cats: any[]): any[] => {
        return cats.sort((a, b) => {
          if (a.level !== b.level) return a.level - b.level;
          return a.title.localeCompare(b.title);
        }).map(cat => ({
          ...cat,
          children: cat.children ? sortCategories(cat.children) : []
        }));
      };

      return sortCategories(rootCategories);
    };

    const categoryTree = buildCategoryTree(allCategories);
    
    res.json({
      data: categoryTree,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: allCategories.length,
        itemsPerPage: allCategories.length
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

router.post('/categories', adminAuth, async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    const category = new Category(categoryData);
    await category.save();
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
});

router.put('/categories/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;

    // Remove title from update data to prevent title changes
    const { title, ...updateData } = categoryData;

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json(category);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating category', error: error.message });
  }
});

router.delete('/categories/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
});

// Project Management
router.get('/projects', adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const search = req.query.search as string || '';
    const status = req.query.status as string || '';
    const userFilter = req.query.userFilter as string || '';
    
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (status && status !== 'all') {
      query = { ...query, status };
    }

    if (userFilter) {
      query = { ...query, userId: userFilter };
    }
    
    const totalProjects = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('userId', 'email firstName lastName createdAt')
      .populate('blueprintId', 'title')
      .populate('categoryId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // console.log('Projects with populated user data:', JSON.stringify(projects, null, 2));
    
    const totalPages = Math.ceil(totalProjects / limit);
    
    res.json({
      data: projects,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalProjects,
        itemsPerPage: limit
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

router.put('/projects/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, status, isStarred } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, status, isStarred },
      { new: true }
    ).populate('userId', 'email firstName lastName');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json(project);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

router.delete('/projects/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

// Blueprint Management
router.get('/blueprints', adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const search = req.query.search as string || '';
    const userFilter = req.query.userFilter as string || '';
    
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { offerType: { $regex: search, $options: 'i' } }
        ]
      };
    }

    if (userFilter) {
      query = { ...query, userId: userFilter };
    }
    
    const totalBlueprints = await Blueprint.countDocuments(query);
    const blueprints = await Blueprint.find(query)
      .populate('userId', 'email firstName lastName createdAt')
      .populate('categories', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // console.log('Blueprints with populated user data:', JSON.stringify(blueprints, null, 2));
    
    const totalPages = Math.ceil(totalBlueprints / limit);
    
    res.json({
      data: blueprints,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalBlueprints,
        itemsPerPage: limit
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching blueprints', error: error.message });
  }
});

router.put('/blueprints/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, offerType, isStarred } = req.body;

    const blueprint = await Blueprint.findByIdAndUpdate(
      id,
      { title, description, offerType, isStarred },
      { new: true }
    ).populate('userId', 'email firstName lastName');

    if (!blueprint) {
      return res.status(404).json({ message: 'Blueprint not found' });
    }

    return res.json(blueprint);
  } catch (error: any) {
    return res.status(500).json({ message: 'Error updating blueprint', error: error.message });
  }
});

router.delete('/blueprints/:id', adminAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blueprint = await Blueprint.findByIdAndDelete(id);
    
    if (!blueprint) {
      return res.status(404).json({ message: 'Blueprint not found' });
    }

    return res.json({ message: 'Blueprint deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting blueprint', error: error.message });
  }
});

// Activity Management
router.get('/activities', adminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const type = (req.query.type as string) || "";
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * limit;


    let query: any = {};

    if (type && type !== "all") {
      query.type = type;
    }

    // code change here

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
   
      ];
    }

    const totalActivities = await Activity.countDocuments(query);
    const activities = await Activity.find(query)
      .populate("userId", "email firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalActivities / limit);

    res.json({
      data: activities,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalActivities,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

export default router; 