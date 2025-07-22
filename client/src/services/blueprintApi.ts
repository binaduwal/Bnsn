import { api, errorHandler } from "./api"
import { Category } from "./categoryApi";

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




