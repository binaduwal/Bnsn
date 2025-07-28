import { Response } from "express";
import { BlueprintValue, ProjectCategoryValue } from "../types/project";
import { executeService, createProgressCallback } from "./serviceRegistry";
import { registerAllServices } from "./serviceRegistration";

interface Props {
    blueprintValues: {
        title: any;
        values: any;
    }[],
    fieldValue: {
        key: string;
        value: string[];
    }[],
    res: Response,
    title: string,
    sendSSE: (data: any) => void,
    mainCategory: string,
    homepageReference?: string, // Add homepage reference
}

// Initialize services on module load
registerAllServices();

// Dynamic content generation function
export const generatedContent = async ({ blueprintValues, fieldValue, res, title, sendSSE, mainCategory, homepageReference }: Props) => {
    const trimmedTitle = title.trim();
    
    try {
        const progressCallback = createProgressCallback(sendSSE);
        
        // Use the dynamic service execution with category ID and main category title
        const result = await executeService(
            trimmedTitle,
            blueprintValues,
            fieldValue,
            mainCategory,
            progressCallback,
            homepageReference
        );

        return result;
    } catch (error) {
        console.error(`Error generating content for "${trimmedTitle}":`, error);
        return null;
    }
};