import { api, errorHandler } from "./api"

interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
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