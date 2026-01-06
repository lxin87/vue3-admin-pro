<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { Expand, Fold } from '@element-plus/icons-vue'

const appStore = useAppStore()

const toggleSideBar = () => {
  appStore.toggleSideBar()
}
</script>

<template>
  <div class="navbar">
    <el-icon class="hamburger" @click="toggleSideBar">
      <component :is="appStore.sidebar.opened ? Fold : Expand" />
    </el-icon>
  </div>
</template>

<style scoped>
.hamburger {
  font-size: 20px;
  cursor: pointer;
  padding: 0 15px;
}
</style>