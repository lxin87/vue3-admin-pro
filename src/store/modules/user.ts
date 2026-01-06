// src/store/modules/user.ts

import { getInfoApi ,type UserInfoResult} from "@/api/auth"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem("token") || "");
  const userInfo = ref<any>(null);
  const menus = ref<any[]>([]);
  const permissions = ref<string[]>([]);
  const isGetInfo = ref(false); // 记录是否已经拉取过权限

  /** 获取用户信息及权限 */
  const getInfo = async ():Promise<UserInfoResult> => {
    try {
      const res = await getInfoApi();
      userInfo.value = res.user;
      menus.value = res.menus;
      permissions.value = res.permissions;
      isGetInfo.value = true; // 标记拉取成功
      return res;
    } catch (error) {
      // 如果获取失败（如 Token 过期），通常需要清理数据并跳转登录
      isGetInfo.value = false;
      clearStorage();
      return Promise.reject(error);
    }
  };

  // 更新用户信息的方法
  function setUserInfo(data: any) {
    userInfo.value = { ...userInfo.value, ...data }
  }

  /** 清理存储 */
  const clearStorage = () => {
    token.value = "";
    userInfo.value = null;
    menus.value = [];
    permissions.value = [];
    isGetInfo.value = false;
    localStorage.removeItem("token");
  };

  return {
    token,
    userInfo,
    menus,
    permissions,
    getInfo,
    clearStorage,
    isGetInfo,
    setUserInfo
  };
})