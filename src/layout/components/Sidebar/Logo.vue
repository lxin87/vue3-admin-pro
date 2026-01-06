<template>
  <div class="sidebar-logo-container">
    <router-link class="sidebar-logo-link" to="/">
      <img src="https://vuejs.org/images/logo.png" class="sidebar-logo">
      <h1 class="sidebar-title">Vue3 Admin Pro</h1>
    </router-link>
  </div>
</template>

<style scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px; /* 设置一个固定高度 */
  line-height: 60px;
  background: #2b2f3a; /* 建议比菜单背景稍深一点，增强层次感 */
  text-align: center;
  overflow: hidden;
}

.sidebar-logo-link {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.sidebar-logo {
  width: 32px;
  height: 32px;
  vertical-align: middle;
}

.sidebar-title {
  display: inline-block;
  margin: 0;
  color: #fff;
  font-weight: 600;
  line-height: 50px;
  font-size: 16px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  vertical-align: middle;
  margin-left: 12px;
}
</style>