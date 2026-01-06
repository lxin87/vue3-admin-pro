<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <p class="error-message">抱歉，您访问的页面不存在或已被移除。</p>
      <div class="error-actions">
        <el-button type="primary" size="large" @click="goHome">
          返回首页
        </el-button>
        <el-button size="large" @click="router.back()">
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
  color: #303133;
}

.error-content {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  margin: 0;
  color: #409eff;
  line-height: 1.2;
  /* 增加点立体感 */
  text-shadow: 4px 4px 0px rgba(64, 158, 255, 0.1);
}

.error-message {
  font-size: 20px;
  color: #606266;
  margin: 20px 0 40px;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>