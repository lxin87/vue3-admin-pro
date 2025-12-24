import service from "@/utils/request";
import type { ApiResponse,UserModel } from "./types";

// 登录参数
export interface LoginParams{
    username:string;
    password:string;
}

//登录结果
export interface LoginResult{
    token:string;
    userInfo:UserModel;
}

export const loginApi = (params:LoginParams) =>{
    return service.post<any,ApiResponse<LoginResult>>('/login',params)
}

export const logoutApi = () =>{
    return service.post<any,ApiResponse<null>>('/logout')
}