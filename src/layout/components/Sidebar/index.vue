<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'

const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const { sidebar } = storeToRefs(appStore)

// 1. 从 Pinia 中获取后端返回的树形菜单
const { menus } = storeToRefs(userStore)

// 2. 当前激活的菜单 (用于高亮)
const activeMenu = computed(() => route.path)

const isCollapse = computed(() => !sidebar.value.opened) // 获取折叠状态
</script>

<template>
  <div class="has-logo">
    <Logo :collapse="isCollapse" />
    
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        active-text-color="#409EFF"
        text-color="#bfcbd9"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        router
      >
        <sidebar-item v-for="menu in menus" :key="menu.path" :item="menu" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>