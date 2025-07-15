import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

export const errorHandler = (error: any) =>{
    if(error.response){
        return error?.response?.data
    }
    return error
}