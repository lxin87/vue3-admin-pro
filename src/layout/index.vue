<script setup lang="ts">
import Sidebar from './components/Sidebar/index.vue';
import Header from './components/Header.vue';
</script>
<template>
    <el-container class="app-wrapper">
        <el-aside class="sidebar-wrapper">
            <Sidebar />
        </el-aside>
        <el-container class="main-container">
            <el-header height="60px" style="padding: 0;">
                <Header />
            </el-header>

            <el-main class="app-main">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
<style scoped lang="scss">
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.sidebar-wrapper {
  background-color: #001529;
  overflow: hidden; // 防止菜单过多出现双滚动条
}

.main-container {
  height: 100vh; // 占满全屏
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  background-color: #f0f2f5; // 灰色背景，区分内容区
  padding: 20px;
  overflow-y: auto; // 内容过多时只在主区域滚动
}
</style>