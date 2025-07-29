import { api, errorHandler } from './api';

export interface Activity {
  _id: string;
  userId: string;
  type: 'project_created' | 'project_updated' | 'project_starred' | 'project_deleted' | 
        'blueprint_created' | 'blueprint_updated' | 'blueprint_starred' | 'blueprint_deleted' |
        'project_generated' | 'blueprint_cloned';
  title: string;
  description: string;
  metadata?: {
    projectId?: string;
    blueprintId?: string;
    oldStatus?: string;
    newStatus?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ActivitiesResponse {
  success: boolean;
  data: Activity[];
  count: number;
}

export const getActivitiesApi = async (limit?: number, type?: string): Promise<ActivitiesResponse> => {
  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (type) params.append('type', type);
    
    const res = await api.get(`/activities?${params.toString()}`);
    return res.data;
  } catch (error) {
    throw errorHandler(error);
  }
};

export const getActivityTypesApi = async (): Promise<{ success: boolean; data: string[] }> => {
  try {
    const res = await api.get('/activities/types');
    return res.data;
  } catch (error) {
    throw errorHandler(error);
  }
}; 