// src/utils/route.ts
const modules = import.meta.glob("../views/**/*.vue");

export const transformMenuToRoutes = (menus: any[]) => {
  const routes: any[] = [];
  
  // 获取所有扫描到的物理路径 key
  const allViewKeys = Object.keys(modules);

  menus.forEach((menu) => {
    if (menu.type === 2 && menu.component) {
      const comp = menu.component;
      
      // 构造我们认为正确的 key
      // 绝大多数 Vite 项目中，这里的 key 应该是 "../views/system/admin/index.vue"
      const targetKey = `../views/${comp}.vue`;
      
      // 查找是否存在这个 key
      let component = modules[targetKey];

      // 如果找不到，尝试手动补全 /index
      if (!component) {
        const fallbackKey = `../views/${comp}/index.vue`;
        component = modules[fallbackKey];
      }

      if (component) {
        routes.push({
          path: menu.path,
          name: menu.path.replace(/\//g, "_") + "_" + menu.id,
          component: component,
          meta: {
            title: menu.title,
            icon: menu.icon,
            hidden: menu.is_hidden === 1,
            permCode: menu.perm_code
          }
        });
      } else {
        // 🆘 核心诊断输出：如果还是匹配不上，打印出前 5 个扫描到的 Key 
        // 让你直接对比字符串哪里不一样
        console.error(`❌ 匹配失败: [${comp}]`);
        console.log(`试图匹配的 Key: ${targetKey}`);
        console.log(`实际存在的 Key 示例 (前5个):`, allViewKeys.slice(0, 5));
      }
    }

    if (menu.children && menu.children.length > 0) {
      routes.push(...transformMenuToRoutes(menu.children));
    }
  });

  return routes;
};