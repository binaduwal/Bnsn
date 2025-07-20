export type BlueprintValue = {
    title: string;
    values: {
        _id: string;
        key?: string;
        value?: string;
    }[];
};

export type ProjectCategoryValue = {
    key?: string;
    value?: string;
};