import { api, errorHandler } from "./api"

export const getEffectiveAliasApi = async (projectId: string, categoryId: string) => {
    try {
        const res = await api.get(`/user-category-aliases/effective/${projectId}/${categoryId}`)
        return res.data as { effectiveAlias: string }
    } catch (error) {
        throw errorHandler(error)
    }
}

export const setCustomAliasApi = async (projectId: string, categoryId: string, customAlias: string) => {
    try {
        const res = await api.post(`/user-category-aliases/${projectId}/${categoryId}`, { customAlias })
        return res.data as { success: boolean, userAlias: UserCategoryAlias }
    } catch (error) {
        throw errorHandler(error)
    }
}

export const removeCustomAliasApi = async (projectId: string, categoryId: string) => {
    try {
        const res = await api.delete(`/user-category-aliases/${projectId}/${categoryId}`)
        return res.data as { success: boolean, removed: boolean }
    } catch (error) {
        throw errorHandler(error)
    }
}

export const getUserCustomAliasesApi = async (projectId: string) => {
    try {
        const res = await api.get(`/user-category-aliases/${projectId}`)
        return res.data as { userAliases: UserCategoryAlias[] }
    } catch (error) {
        throw errorHandler(error)
    }
}

export const getCategoriesWithEffectiveAliasesApi = async (projectId: string, filter?: any) => {
    try {
        const queryParams = new URLSearchParams(filter).toString()
        const res = await api.get(`/user-category-aliases/${projectId}/categories/effective${queryParams ? `?${queryParams}` : ''}`)
        return res.data as { categories: CategoryWithEffectiveAlias[] }
    } catch (error) {
        throw errorHandler(error)
    }
}

export type UserCategoryAlias = {
    _id: string;
    userId: string;
    projectId: string;
    categoryId: string;
    customAlias: string;
    createdAt: string;
    updatedAt: string;
};

export type CategoryWithEffectiveAlias = {
    _id: string;
    title: string;
    alias: string;
    effectiveAlias: string; // The effective alias (custom or default)
    type: string;
    parentId: string | null;
    description: string;
    fields: Field[];
    level: number;
    settings?: any;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type Field = {
    fieldName: string;
    fieldType: string;
    _id: string;
}; 