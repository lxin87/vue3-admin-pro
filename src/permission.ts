// src/permission.ts
import router from "./router";
import { transformMenuToRoutes } from "@/utils/route";
import { useUserStore } from "./store/modules/user";


const whiteList = ["/login"];
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const token = localStorage.getItem("token");

  if (token) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (!userStore.isGetInfo) {
        try {
          // 1. 获取权限信息
          const { menus } = await userStore.getInfo();
          
          // 2. 将菜单转换为路由对象
          const dynamicRoutes = transformMenuToRoutes(menus);
          
          // 3. 将路由动态添加到现有的路由配置中（通常挂载在 layout 路由下）
          dynamicRoutes.forEach(route => {
            // 'layout' 是你主页面的路由名称
            router.addRoute('layout', route);
          });

          
          // 4. 【重要】在所有动态路由挂载后，最后添加 404 兜底路由
          // 这样可以解决刷新页面时，动态路由还没加载完就直接匹配到 404 的问题
          router.addRoute({
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: () => import("@/views/error/404.vue"),
            meta: { hidden: true }
          });
          // 5. 关键：添加完路由后，需要重新触发一次跳转
          // 关键修正：
          // 如果我们要去的路径在当前路由表里找不到（to.matched 为空）
          // 且我们已经确信动态路由已经添加完毕
          if (to.matched.length === 0) {
            // 重新定位到当前完整路径，replace: true 确保不会留下多余的历史记录
            next({ path: to.fullPath, replace: true });
          } else {
            next({ ...to, replace: true });
          }
        } catch (err) {
          userStore.clearStorage();
          next("/login");
        }
      } else {
        next();
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next();
    } else {
      //TODO::处理redirect
      next(`/login?redirect=${to.path}`);
    }
  }
});

