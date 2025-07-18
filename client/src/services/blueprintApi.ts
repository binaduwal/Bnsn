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

export type CategoryValue = {
    _id: string;
    category: string; // ObjectId as string
    blueprint: string; // ObjectId as string
    value: {
        key: string;
        value: string;
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




