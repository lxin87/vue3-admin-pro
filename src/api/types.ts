// 1. 定义通用的响应结构
// T 是泛型，代表 data 具体的类型（可能是 User，可能是 OrderList，由调用方决定）
export interface ApiResponse<T = any> {
    code:number;
    msg:string;
    data:T;
}

export interface PaginateData<T> {
    current_page:number;
    data:T[];
    first_page_url:string;
    from:number;
    last_page:number;
    last_page_url:string;
    links:any[];
    next_page_url:string;
    path:string;
    per_page:number;
    prev_page_url:string;
    to:number;
    total:number;

}

/**
 * 核心用户模型 (对应后端的 User 实体)
 * 整个系统通用的 User 定义
 *//**
 * 核心用户模型 (对应后端的 User 实体)
 * 整个系统通用的 User 定义
 */

 export interface AdminModel{
    id:number;
    username:string;
    name:string;
    avatar:string;
    email?:string;
    phone?:string;
    status?:number;
    created_at?:string;
 }