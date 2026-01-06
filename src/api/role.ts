import service from "@/utils/request";
import type { PaginateData } from "./types";

export interface RoleModel{
  id:number;
  name:string;
  code:string;
  remark?:string;
  status:number;
  created_at?:string;
}

/** 角色查询参数模型 */
export interface RoleQueryParams {
  name?: string;     // 按角色名称搜索
  code?: string;     // 按角色标识搜索
  status?: number;   // 按状态搜索
  page?: number;     // 页码
  pageSize?: number; // 每页条数
}
/** 分配权限参数模型 */
export interface AssignMenuParams {
  menu_ids: number[];
}
/**
 * 获取角色列表API接口
 * @param params - 请求参数，可选参数对象
 * @returns 返回角色模型数组的Promise
 */
export const getRoleListApi = (params?:RoleQueryParams) => {
  return service.get<any,PaginateData<RoleModel>>('/roles',{params})
}

/** 新增角色 */
export const createRoleApi = (data: Partial<RoleModel>) => {
  return service.post('/roles', data)
}

/** 更新角色 */
export const updateRoleApi = (id: number, data: Partial<RoleModel>) => {
  return service.put(`/roles/${id}`, data)
}

/** 更新角色状态 (PATCH 局部更新) */
export const updateRoleStatusApi = (id: number, status: number) => {
  return service.patch(`/roles/${id}/status`, { status })
}

/** 删除角色 */
export const deleteRoleApi = (id: number) => {
  return service.delete(`/roles/${id}`)
}

/**
 * 分配角色菜单权限API
 * 为指定角色分配菜单权限
 * @param roleId - 角色ID，用于标识需要分配菜单的角色
 * @param menuIds - 菜单ID数组，包含需要分配给角色的菜单权限
 * @returns 返回API请求的响应结果
 */
export const assignRoleMenuApi = (roleId:number,data:AssignMenuParams) =>{
  return service.post<any,any>(`/roles/${roleId}/menus`,data)
}
/**
 * 获取角色对应的菜单ID列表
 * @param roleId - 角色ID，用于查询对应角色的菜单权限
 * @returns 返回包含菜单ID的数组的Promise对象
 */
export const getRoleMenuIdsApi = (roleId:number) =>{
  return service.get<any,number[]>(`/roles/${roleId}/menu-ids`)
}