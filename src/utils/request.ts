import axios,{ type AxiosInstance, type AxiosError, type AxiosResponse,type InternalAxiosRequestConfig} from "axios";
import { ElMessageBox,ElMessage } from "element-plus";

import { type ApiResponse } from "@/api/types";

// 1. 创建 Axios 实例
const service:AxiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BASE_URL || '/api',
    timeout:10000,
    headers:{'Content-Type':'application/json;charset=utf-8'}
})

// 2. 请求拦截器
service.interceptors.request.use(
    (config:InternalAxiosRequestConfig) =>{
        // TODO: 这里以后要从 Pinia 获取 Token
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error:AxiosError) =>{
        return Promise.reject(error)
    }
)

// 3.拦截响应器
service.interceptors.response.use(
    (response:AxiosResponse) => {
        const {code,msg,data} = response.data as ApiResponse
        // 情况 A: 业务成功 (和后端约定 code 200 为成功)
        if(code === 200){
            return data
        }
        // 情况 B: 业务错误 (如 10001 用户名不存在)
        ElMessage.error(msg || '系统错误')
        return Promise.reject(new Error(msg || 'Error'))
    },
    (error:AxiosError) => {
        // 情况 C: HTTP 网络错误 (Status Code != 2xx)
        const {response} = error
        if(response){
            switch (response.status){
                
                case 401:
                    // Token 过期或未登录
                    ElMessageBox.confirm('您的登录已过期。','系统提示',{
                        confirmButtonText:'重新登录',
                        cancelButtonText:'取消',
                        type:'warning'
                    }).then(()=>{
                        // TODO: 调用 Pinia 的 logout 方法并跳转登录页
                        localStorage.removeItem('token')
                        window.location.href='/login'
                    })
                    break
                case 403:
                    ElMessage.error('当前操作没有权限')
                    break
                case 404:
                    ElMessage.error('请求的资源不存在')
                    break
                case 500:
                    ElMessage.error('服务器内部错误 (Laravel Exception)')
                    break
                default:
                    ElMessage.error(`连接错误,${error.message}`)                
            }
        } else{
            if(error.message.includes('timeout')){
                ElMessage.error('请求超时，请检查网络')
            } else{
                ElMessage.error('网络连接异常')
            }
        }
        return Promise.reject(error)
        
    }
)

export default service