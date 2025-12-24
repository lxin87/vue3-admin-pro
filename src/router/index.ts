import { createRouter,createWebHistory,type RouteRecordRaw } from "vue-router";

const routes:RouteRecordRaw[] = [
    {
        path:'/login',
        name:'Login',
        component:()=>import('@/views/login/index.vue'),
        meta:{
            title:'登录'
        }
    },
    {
        path:'/',
        name:'Home',
        component:()=>import('@/views/system/index.vue'),
        meta:{
            title:'首页'
        }
    },
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router;