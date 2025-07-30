import { api, errorHandler } from './api'
import { Field } from './categoryApi'
import Cookies from "js-cookie";
export const createProjectApi = async (body: { name: string, blueprintId?: string, categoryId?: string[], description?: string, mode?: string, offerType?: string, type?: string }) => {
    try {
        const res = await api.post('/projects', body)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export const getAllProjectsApi = async () => {
    try {
        const res = await api.get('/projects')
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

// Alias for backward compatibility
export const getAllProjectApi = getAllProjectsApi;

export const getSingleProjectApi = async (id: string) => {
    try {
        const res = await api.get(`/projects/${id}`)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

// Alias for backward compatibility
export const singleProjectApi = getSingleProjectApi;

export const updateProjectApi = async (id: string, body: { name?: string, status?: string, isStarred?: boolean, settings?: { focus?: string, tone?: string, quantity?: string } }) => {
    try {
        const res = await api.put(`/projects/${id}`, body)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export const deleteProjectApi = async (id: string) => {
    try {
        const res = await api.delete(`/projects/${id}`)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export const starProjectApi = async (id: string) => {
    try {
        const res = await api.put(`/projects/${id}/star`)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export const generateProjectApi = async (body: { category: string, project: string, values: { [key: string]: string, }, blueprintId: string }) => {
    try {
        const res = await api.post('/projects/generate', body)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export const generateProjectStreamApi = async (body: {
    category: string,
    project: string,
    values: { [key: string]: string },
    blueprintId?: string,
    currentCategory?: string
}) => {
    const token = Cookies.get("token")
    try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

        const controller = new AbortController();

        // Set a timeout for the request (5 minutes)
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 300000); // 5 minutes

        const response = await fetch(`${baseURL}/projects/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return response; // Return Response object for streaming
    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out after 5 minutes');
        }
        throw errorHandler(error);
    }
}

export const generateContinuousProjectApi = async (body: {
    tasks: Array<{
        title: string;
        category: string;
        values: { [key: string]: string };
    }>;
    blueprintId: string;
    parallel?: boolean;
    maxConcurrent?: number;
}) => {
    try {
        const res = await api.post('/projects/generate-continuous', body)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export const getAvailableServicesApi = async () => {
    try {
        const res = await api.get('/projects/services')
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export interface Project {
    _id: string;
    blueprintId: {
        _id: string;
        title: string;
    };
    userId: string;
    name: string;
    description: string;
    status: 'Draft' | 'Published' | 'Archived'; // You can adjust or extend these statuses
    isStarred: boolean;
    createdAt: string;
    updatedAt: string;
    categoryId: Category[];
    __v: number;
}



export interface ThirdCategory {
    _id: string;
    title: string;
    alias: string;
    effectiveAlias?: string; // The effective alias (custom or default)
    type: string;
    parentId: string;
    description: string;
    fields: Field[];
    level: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    fieldValue: FieldValue;
}

export interface SubCategory {
    _id: string;
    title: string;
    alias: string;
    effectiveAlias?: string; // The effective alias (custom or default)
    type: string;
    parentId: string;
    description: string;
    fields: Field[];
    level: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    thirdCategories: ThirdCategory[];
    fieldValue: FieldValue;
}

export interface Category {
    _id: string;
    title: string;
    alias: string;
    effectiveAlias?: string; // The effective alias (custom or default)
    type: string;
    parentId: string | null;
    description: string;
    fields: Field[];
    fieldValue: FieldValue;
    level: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    subCategories: SubCategory[];
}
interface FieldValue {
    _id: string;
    category: string;
    project: string;
    isAiGeneratedContent: string; // contains HTML and comment blocks as a string
    value: {
        key: string;
        value: string[]; // array of idea strings
        _id: string;
    }[];
    __v: number;
};

export const updateProjectCategoryApi = async (id: string, categoryId: string[]) => {
    try {
        const res = await api.post('/projects/update-category/' + id, { categoryId })
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}