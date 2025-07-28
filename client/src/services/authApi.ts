import { api, errorHandler } from "./api"

interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface WordCountData {
    totalWords: number;
    wordsUsed: number;
    wordsLeft: number;
}

export const registerApi = async (payload: RegisterPayload) => {
    try {
        const res = await api.post('/auth/register', {...payload,role:"user"})
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export const loginApi = async (payload: { email: string, password: string }) => {
    try {
        const res = await api.post('/auth/login', payload)
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}

export const getWordCountApi = async (): Promise<{ success: boolean; data: WordCountData }> => {
    try {
        const res = await api.get('/auth/word-count')
        return res.data
    } catch (error) {
        throw errorHandler(error)
    }
}