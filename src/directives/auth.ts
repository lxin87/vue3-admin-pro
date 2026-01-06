// src/directives/auth.ts
import { useUserStore } from '@/store/modules/user'

export const auth = {
  mounted(el: HTMLElement, binding: any) {
    const { value } = binding
    if (!value) return

    const userStore = useUserStore()
    const permissions = userStore.permissions

    // 1. 直接判断字符串是否存在于权限数组中
    const hasPermission = permissions.includes(value)

    // 2. 调试：如果按钮没消失，打开下面这行看对比
    //console.log(permissions)
    //console.log(`按钮:${el.innerText} | 需要:${value} | 结果:${hasPermission}`)

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}