<script setup lang="ts">
// 接收父组件传来的菜单项
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <template v-if="!item.is_hidden && item.type !==3">
    
    <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
      <template #title>
        <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
        <span>{{ item.title }}</span>
      </template>
      
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
      />
    </el-sub-menu>

    <el-menu-item v-else :index="item.path">
      <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
      <template #title>
        <span>{{ item.title }}</span>
      </template>
    </el-menu-item>
    
  </template>
</template>