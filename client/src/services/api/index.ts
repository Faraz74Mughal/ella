import { SERVER_PATH_API } from "@/config"
import axios from "axios"

const apiAuth = axios.create({
    baseURL:SERVER_PATH_API
})

const api = axios.create({
    baseURL:SERVER_PATH_API
})

api.interceptors.request.use((req)=>{
    return req
})

api.interceptors.response.use((res)=>{
    return res
})

export {api,apiAuth}