<script setup lang="ts">
import Sidebar from './components/Sidebar/index.vue';
import Header from './components/Header.vue';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
</script>
<template>
    <el-container class="app-wrapper">
        <el-aside class="sidebar-wrapper" width="210px">
            <Sidebar />
        </el-aside>
        <el-container class="main-container">
            <el-header height="60px" style="padding: 0;">
                <Header />
            </el-header>

            <el-main class="app-main">
              <div class="breadcrumb-wrapper">
                <breadcrumb id="breadcrumb-container" />
              </div>
              
              <div class="content-view">
                <router-view />
              </div>
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
  background-color: #f0f2f5; 
  padding: 0; // 改为0，由内部容器控制 padding
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.breadcrumb-wrapper {
  padding: 12px 20px;
  background-color: #fff; // 面包屑通常背景为白，或者跟 header 一致
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px; // 与下方内容的间距
}

.content-view {
  padding: 0 20px 20px 20px;
  flex: 1;
}
</style>