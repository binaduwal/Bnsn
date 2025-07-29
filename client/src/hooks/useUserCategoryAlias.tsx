import { useState, useCallback } from 'react';
import { 
    getEffectiveAliasApi, 
    setCustomAliasApi, 
    removeCustomAliasApi, 
    getUserCustomAliasesApi,
    getCategoriesWithEffectiveAliasesApi,
    UserCategoryAlias,
    CategoryWithEffectiveAlias
} from '../services/userCategoryAliasApi';

export const useUserCategoryAlias = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getEffectiveAlias = useCallback(async (projectId: string, categoryId: string): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const response = await getEffectiveAliasApi(projectId, categoryId);
            return response.effectiveAlias;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get effective alias';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const setCustomAlias = useCallback(async (projectId: string, categoryId: string, customAlias: string): Promise<UserCategoryAlias> => {
        setLoading(true);
        setError(null);
        try {
            const response = await setCustomAliasApi(projectId, categoryId, customAlias);
            return response.userAlias;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to set custom alias';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const removeCustomAlias = useCallback(async (projectId: string, categoryId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const response = await removeCustomAliasApi(projectId, categoryId);
            return response.removed;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to remove custom alias';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserCustomAliases = useCallback(async (projectId: string): Promise<UserCategoryAlias[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserCustomAliasesApi(projectId);
            return response.userAliases;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get user custom aliases';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCategoriesWithEffectiveAliases = useCallback(async (projectId: string, filter?: any): Promise<CategoryWithEffectiveAlias[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCategoriesWithEffectiveAliasesApi(projectId, filter);
            return response.categories;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get categories with effective aliases';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        getEffectiveAlias,
        setCustomAlias,
        removeCustomAlias,
        getUserCustomAliases,
        getCategoriesWithEffectiveAliases,
        clearError
    };
}; 