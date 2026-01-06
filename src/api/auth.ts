import service from "@/utils/request";
import type { AdminModel } from "./types";

// 登录参数
export interface LoginParams{
    username:string;
    password:string;
}

//登录结果
export interface LoginResult{
    token:string;
    userInfo:AdminModel;
}

/** 用户权限信息返回结构 */
export interface UserInfoResult {
  user: {
    id: number;
    username: string;
    avatar?: string;
    [key: string]: any;
  };
  menus: any[];        // 树形菜单
  permissions: string[]; // 按钮权限标识数组
}

export const loginApi = (params:LoginParams) =>{
    return service.post<any,LoginResult>('/login',params)
}

export const getInfoApi = () =>{
    return service.get<any, UserInfoResult>("/auth/info");
}

export const logoutApi = () =>{
    return service.post<any,null>('/logout')
}