<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElMessage,ElMessageBox } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { logoutApi } from '@/api/auth';
import { useUserStore } from '@/store/modules/user';

const route = useRouter();
const userStr = localStorage.getItem('user');
const userInfo  = userStr ? JSON.parse(userStr) : {};

// 跳转到个人中心页面
const handleToProfile = () => {
  route.push('/system/profile')
}
const handleLogout = () =>{
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        // 1.发送请求
        await logoutApi()
        // 2.清除本地数据
        const userStore = useUserStore()
        userStore.clearStorage()
        ElMessage({
            type: 'success',
            message: '退出登录成功',
        })
        // 3.跳转
        route.push('/login')
    })
}
</script>
<template>
    <div class="header-container">
        <div class="left">
            <h3>首页</h3>
        </div>
        <div class="right">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="avatar" class="avatar" />
                    <span class="username">{{ userInfo.name }}</span>
                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                      <div v-auth="'sys:profile:index'">
                        <el-dropdown-item @click="handleToProfile" >
                          个人中心
                        </el-dropdown-item>
                      </div>
                      <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<style scoped lang="scss">
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;

  .right {
    .el-dropdown-link {
      cursor: pointer;
      display: flex;
      align-items: center;
      
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 8px;
        background-color: #eee;
      }
      .username {
        font-weight: 500;
      }
    }
  }
}
</style>