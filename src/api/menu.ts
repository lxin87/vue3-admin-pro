import service from "@/utils/request";

export interface MenuModel {
    id: number;
    parent_id: number;
    title: string;
    icon?:string;
    path?:string;
    component?:string;
    perm_code?:string;
    type: 1|2|3;
    sort:number;
    status?:number;
    is_hidden:number,
    children?:MenuModel[];
}

export const getMenuListApi = () =>{
    return service.get<any,MenuModel[]>('/menus');
}

export const createMenuApi = (data:Partial<MenuModel>) =>{
    return service.post<any,null>('/menus',data)
}

export const getMenuTreeApi = () =>{
    return service.get<any,MenuModel[]>('/menus');
}

export const updateMenuApi = (id:number,data:any) =>{
    return service.put<any,null>(`/menus/${id}`,data)
}

export const deleteMenuApi = (id:number) =>{
    return service.delete<any,null>(`/menus/${id}`)
}