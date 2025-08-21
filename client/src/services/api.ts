import axios from "axios";
import Cookies from "js-cookie";

  export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})


api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export const errorHandler = (error: any) => {
    if (error.response) {
        return error?.response?.data
    }
    return error
}