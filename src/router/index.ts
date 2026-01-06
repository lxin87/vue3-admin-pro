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
      path: '/',
      name: 'layout',
      component: () => import('@/layout/index.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '首页', icon: 'HomeFilled' }
        }
      ]
    },
    
    // 3. 404 页面 (兜底)
    {
      path: '/404',
      component: () => import('@/views/error/404.vue'),
      meta: { hidden: true }
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router;