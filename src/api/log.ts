import service from "@/utils/request";

export const getLogListApi = (params:any) =>{
    return service.get<any,any>('system/logs',{params})
}