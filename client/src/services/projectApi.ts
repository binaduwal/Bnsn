import { api, errorHandler } from "./api";
import { Field } from "./categoryApi";
import Cookies from "js-cookie";


interface CategoryBodyProps {
    name: string;
    description: string;
    blueprintId: string
    categoryId: string[];
}
export const createProjectApi = async (body: CategoryBodyProps) => {
    try {
        console.log('body', body)
        const res = await api.post('/projects', body)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}


export const singleProjectApi = async (id: string) => {
    try {
        const res = await api.get('/projects/' + id)
        return res.data as { success: boolean, data: Project }
    } catch (error) {
        throw errorHandler(error)
    }
}

export const deleteProjectApi = async (id: string) => {
    try {
        const res = await api.delete('/projects/' + id)
        return res.data as { success: boolean, data: Project }
    } catch (error) {
        throw errorHandler(error)
    }
}

export const getAllProjectApi = async () => {
    try {
        const res = await api.get('/projects')
        return res.data as { success: boolean, data: Project[] }
    } catch (error) {
        throw errorHandler(error)
    }
}


export const generateProjectApi = async (body: { category: string, project: string, values: { [key: string]: string, }, blueprintId: string }) => {
    try {
        const res = await api.post('/projects/generate', body)
        console.log('api res', res)
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
        const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

        const response = await fetch(`${baseURL}/projects/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    
        return response; // Return Response object for streaming
    } catch (error) {
        throw errorHandler(error);
    }
};

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