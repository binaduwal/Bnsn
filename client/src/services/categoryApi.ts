import { api, errorHandler } from "./api"

export const allCategoryApi = async (type: string, level?: number, projectId?: string) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('type', type);
        if (level !== undefined) {
            queryParams.append('level', level.toString());
        }
        if (projectId) {
            queryParams.append('projectId', projectId);
        }
        
        const res = await api.get(`/category?${queryParams.toString()}`)
        return res.data as { success: boolean, data: Category[] }
    } catch (error) {
        throw errorHandler(error)
    }
}

export const createCategoryApi = async (data: { title: string, alias?: string, description?: string, fields?: Field[], settings?: any, parentId?: string, type: string }) => {
    try {
        const res = await api.post('/category', data)
        return res.data as Category
    } catch (error) {
        throw errorHandler(error)
    }
}

export const updateCategoryApi = async (id: string, data: Partial<Category>) => {
    try {
        const res = await api.put(`/category/${id}`, data)
        return res.data as Category
    } catch (error) {
        throw errorHandler(error)
    }
}

export type Category = {
    _id: string;
    title: string;
    alias: string;
    effectiveAlias?: string; // The effective alias (custom or default)
    type: string; // If you want to be specific, use: "project" | other possible values
    parentId: string | null;
    description: string;
    fields: Field[]; // Replace `any` with a more specific type if you know the structure of each field
    level: number;
    createdAt: string; // Or Date if you convert it
    updatedAt: string; // Or Date if you convert it
    __v: number;
};

export type Field = {
    fieldName: string;
    fieldType: string;
    _id: string;
};
