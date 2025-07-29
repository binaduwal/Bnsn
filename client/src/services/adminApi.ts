import { api } from './api';

// User Management
export interface AdminUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
  totalWords: number;
  wordsUsed: number;
  wordsLeft: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const adminApi = {
  // User Management
  getUsers: async (page = 1, limit = 25, search = ''): Promise<PaginatedResponse<AdminUser>> => {
    const response = await api.get('/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  },

  updateUser: async (userId: string, data: Partial<AdminUser>): Promise<AdminUser> => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  // Category Management
  getCategories: async (page = 1, limit = 25, search = ''): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/admin/categories', {
      params: { search } // Only pass search parameter, ignore pagination for tree view
    });
    return response.data;
  },

  createCategory: async (data: any): Promise<any> => {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (categoryId: string, data: any): Promise<any> => {
    const response = await api.put(`/admin/categories/${categoryId}`, data);
    return response.data;
  },

  // Project Management
  getProjects: async (page = 1, limit = 25, search = '', status = '', userFilter = ''): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/admin/projects', {
      params: { page, limit, search, status, userFilter }
    });
    return response.data;
  },

  // Blueprint Management
  getBlueprints: async (page = 1, limit = 25, search = '', userFilter = ''): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/admin/blueprints', {
      params: { page, limit, search, userFilter }
    });
    return response.data;
  },

  // Activity Management
  getActivities: async (page = 1, limit = 25, type = ''): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/admin/activities', {
      params: { page, limit, type }
    });
    return response.data;
  },

  // Dashboard Statistics
  getDashboardStats: async (): Promise<any> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },
}; 