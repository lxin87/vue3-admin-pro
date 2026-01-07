<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { updateProfileApi } from '@/api/admin' // 你需要定义的接口

const userStore = useUserStore()
const loading = ref(false)

// 使用 userStore 中的初始值
//TODO::处理头像
const form = reactive({
  id:userStore.userInfo?.id,
  username: userStore.userInfo?.username,
  name: userStore.userInfo?.name,
  phone: userStore.userInfo?.phone,
  avatar: userStore.userInfo?.avatar,
  password: '',
  password_confirmation: ''
})

const submitForm = async () => {
  loading.value = true
  try {
    const {id,...data} = form //删除id属性
    const res = await updateProfileApi(form.id,data)
    ElMessage.success('资料更新成功')
    
    // 关键：同步更新 Pinia 中的状态
    userStore.setUserInfo(res)
    
    // 如果修改了密码，建议提示用户重新登录
    if (form.password) {
      ElMessage.warning('密码已修改，请重新登录')
      userStore.clearStorage()
      window.location.href = '/login'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="app-container">
    <el-card header="个人资料修改">
      <el-form :model="form" label-width="100px" style="max-width: 500px">
        <el-form-item label="帐号">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.password" type="password" show-password placeholder="不修改请留空" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="form.password_confirmation" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>