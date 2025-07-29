import { api, errorHandler } from "./api"
import { Category } from "./categoryApi";
import Cookies from "js-cookie";

interface CreateBlueprintBody {
    title: string;
    description: string;
    offerType: string;
}

export const createBlueprint = async (body: CreateBlueprintBody) => {
    try {
        const res = await api.post('/blueprints', body)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export const createBlueprintStream = async (
    body: CreateBlueprintBody,
    onProgress?: (chunk: string) => void,
    onComplete?: (data: any) => void,
    onError?: (error: string) => void
) => {
    try {
        // Get the token from cookies (same as regular API)
        const token = Cookies.get("token");
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Use the same base URL as the regular API
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
        const response = await fetch(`${baseURL}/blueprints`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Process complete lines
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        
                        switch (data.type) {
                            case 'progress':
                                if (onProgress) {
                                    onProgress(data.content);
                                }
                                break;
                            case 'complete':
                                if (onComplete) {
                                    onComplete(data.data);
                                }
                                break;
                            case 'error':
                                if (onError) {
                                    onError(data.message);
                                }
                                break;
                        }
                    } catch (parseError) {
                        console.warn('Failed to parse SSE data:', parseError);
                    }
                }
            }
        }
    } catch (error) {
        if (onError) {
            onError(error instanceof Error ? error.message : 'Unknown error');
        }
        throw error;
    }
}

export const getAllBlueprintApi = async () => {
    try {
        const res = await api.get('/blueprints',)
        return res.data as { success: boolean, data: BlueprintProps[] }
    } catch (error) {
        throw errorHandler(error)
    }
}

export const getSingleBlueprintApi = async (id: string) => {
    try {
        const res = await api.get('/blueprints/' + id,)
        return res.data as BlueprintResponse
    } catch (error) {
        throw errorHandler(error)
    }
}

export const deleteBlueprintApi = async (id: string) => {
    try {
        const res = await api.delete('/blueprints/' + id)
        return res.data as { success: boolean, data: BlueprintProps }
    } catch (error) {
        throw errorHandler(error)
    }
}

export const starBlueprintApi = async (id: string) => {
    try {
        const res = await api.put(`/blueprints/${id}/star`)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export const cloneBlueprintApi = async (
    id: string, 
    userCopy: string, 
    customTitle?: string,
    onProgress?: (chunk: string) => void,
    onComplete?: (data: any) => void,
    onError?: (error: string) => void
) => {
    try {
        // Get the token from cookies
        const token = Cookies.get("token");
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Use the same base URL as the regular API
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
        const response = await fetch(`${baseURL}/blueprints/${id}/clone`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                userCopy,
                customTitle
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Process complete lines
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        
                        switch (data.type) {
                            case 'progress':
                                if (onProgress) {
                                    onProgress(data.content);
                                }
                                break;
                            case 'complete':
                                if (onComplete) {
                                    onComplete(data.data);
                                }
                                break;
                            case 'error':
                                if (onError) {
                                    onError(data.message);
                                }
                                break;
                        }
                    } catch (parseError) {
                        console.warn('Failed to parse SSE data:', parseError);
                    }
                }
            }
        }
    } catch (error) {
        if (onError) {
            onError(error instanceof Error ? error.message : 'Unknown error');
        }
        throw error;
    }
}

export const updateCategoryValueApi = async ({id,value,isAiGeneratedContent}:{id: string, value?: { key: string; value: string | string[]; _id?: string }[], isAiGeneratedContent?: string}) => {
    try {
        const res = await api.put(`/category/value/${id}`, { value, isAiGeneratedContent })
        return res.data as { success: boolean, data: CategoryValue }
    } catch (error) {
        throw errorHandler(error)
    }
}

export type CategoryValue = {
    _id: string;
    category: string;
    blueprint: string;
    value: {
        key: string;
        value: string | string[];
        _id: string;
    }[];
    __v: number;
};

export type BlueprintProps = {
    _id: string;
    title: string;
    description: string;
    offerType: string;
    isStarred: boolean;
    categories: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type BlueprintResponse = {
    success: boolean;
    data: {
        _id: string;
        title: string;
        description: string;
        offerType: string;
        categories: Category[];
        createdAt: string;
        updatedAt: string;
        __v: number;
    };
    categoryValues: CategoryValue[];
};




