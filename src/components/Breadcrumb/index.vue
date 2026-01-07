<template>
  <el-breadcrumb separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span v-if="index === breadcrumbs.length - 1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter, type RouteLocationMatched } from 'vue-router'

const route = useRoute()
const router = useRouter()
const breadcrumbs = ref<RouteLocationMatched[]>([])

const getBreadcrumb = () => {
  // 1. 获取所有带有 title 的路由记录
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  
  // 2. 如果第一项不是首页，手动加个首页进去（可选）
  const first = matched[0]
  if (first && first.path !== '/dashboard') {
    matched = [{ path: '/dashboard', meta: { title: '首页' } } as any].concat(matched)
  }
  
  breadcrumbs.value = matched
}

const handleLink = (item: RouteLocationMatched) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect as string)
    return
  }
  router.push(path)
}

watch(() => route.path, getBreadcrumb)
onMounted(getBreadcrumb)
</script>
<style lang="scss" scoped>
.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 20px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }

  /* 链接颜色 */
  a {
    font-weight: normal;
    color: #606266;
    &:hover {
      color: #409eff; // 鼠标悬停变色
    }
  }
}

/* 面包屑动画：横向平滑过渡 */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>