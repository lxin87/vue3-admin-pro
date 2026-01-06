import service from "@/utils/request";
import type { PaginateData ,AdminModel} from "./types";

export interface AdminQueryParams{
    page:number;
    pageSize:number;
    username?:string;
}

export const getAdminListApi = (params:AdminQueryParams) =>{
    return service.get<any,PaginateData<AdminModel>>('/admins',{params})
}

export interface CreateAdminParams{
    username:string;
    password:string;
    name:string;
    status:number;
}

export interface UpdateProfileParams{
  username: string,
  name: string,
  phone: string,
  avatar: string,
  password: string,
  password_confirmation: string
}

export const createAdminApi = (params:CreateAdminParams) =>{
    return service.post<any,null>('/admins',params)
}

export const updateAdminApi = (id:number,data:Partial<CreateAdminParams>) =>{
    return service.put<any,null>(`/admins/${id}`,data)
}

export const updateProfileApi = (id:number,data:UpdateProfileParams) => {
    return service.put<any,AdminModel>(`/profile/update`,data)
}

export const deleteAdminApi = (id:number) => {
    return service.delete<any,null>(`/admins/${id}`)
}

/** 获取管理员已有的角色ID */
export const getAdminRoleIdsApi = (adminId: number) => {
  return service.get<any, number[]>(`/admins/${adminId}/role-ids`)
}

/** 分配角色给管理员 */
export const assignAdminRolesApi = (adminId: number, roleIds: number[]) => {
  return service.post<any,null>(`/admins/${adminId}/roles`, { role_ids: roleIds })
}