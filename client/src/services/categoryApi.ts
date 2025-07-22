import { api, errorHandler } from "./api"

export const allCategoryApi = async (type: string, level?: number) => {
    try {
        const res = await api.get(`/category?type=${type}${level !== undefined ? `&level=${level}` : ''}`)
        return res.data as { success: boolean, data: Category[] }
    } catch (error) {
        throw errorHandler(error)
    }
}




export type Category = {
    _id: string;
    title: string;
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
