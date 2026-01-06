import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // state: sidebar 状态，从本地缓存读取初始化值
  const sidebar = ref({
    opened: localStorage.getItem('sidebarStatus') ? !!+(localStorage.getItem('sidebarStatus')!) : true,
    withoutAnimation: false
  })

  // actions: 切换折叠状态
  function toggleSideBar() {
    sidebar.value.opened = !sidebar.value.opened
    if (sidebar.value.opened) {
      localStorage.setItem('sidebarStatus', '1')
    } else {
      localStorage.setItem('sidebarStatus', '0')
    }
  }

  return { sidebar, toggleSideBar }
})