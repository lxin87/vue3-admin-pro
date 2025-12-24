<script setup lang="ts">
import {reactive,ref} from 'vue'
import {useRouter} from 'vue-router'
import {User,Lock} from '@element-plus/icons-vue'
import { loginApi } from '@/api/auth';
import { ElMessage } from 'element-plus';

const router = useRouter()
const loading = ref(false)

const loginForm = reactive({
    username:'admin',
    password:'123456'
})

const rules = {
    username:[
        {required:true,message:"请输入用户名",trigger:'blur'}
    ],
    password:[
        {required:true,message:"请输入密码",trigger:'blur'}
    ]
}

const formRef = ref()

const handleLogin = async() =>{
    //1.校验表单
    if(!formRef.value) return 
    await formRef.value.validate(async (valid:boolean) =>{
        if(!valid) return 
        try{
            loading.value = true
            //2.发送请求
            const res = await loginApi(loginForm)
            localStorage.setItem('token',res.token)
            localStorage.setItem('user',JSON.stringify(res.userInfo))
            ElMessage.success('登录成功')
            router.push('/')
        }catch(error){
            //已在request.ts中处理了.
        }
        finally{
            loading.value = false
        }
    })
}
</script>

<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <img src="https://element-plus.org/images/element-plus-logo.svg" alt="logo">
                <h2>Vue Admin Pro</h2>
            </div>
            <el-form
            ref="formRef"
            :model="loginForm"
            :rules="rules"
            class="login-form"
            size="large"
            >
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" />
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" 
                placeholder="请输入密码" 
                :prefix-icon="Lock" 
                type="password" 
                show-password 
                @keyup.enter="handleLogin"
                />
            </el-form-item>
            <el-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">立即登录</el-button>

            </el-form>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  // 背景图 (可选)
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg'); 
  background-repeat: no-repeat;
  background-position: center 110px;
  background-size: 100%;

  .login-box {
    width: 400px;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .login-header {
      text-align: center;
      margin-bottom: 40px;
      
      img {
        height: 40px;
        vertical-align: bottom;
        margin-right: 10px;
      }
      
      h2 {
        display: inline-block;
        margin: 0;
        font-size: 24px;
        color: #333;
        font-weight: 600;
      }
    }

    .login-btn {
      width: 100%;
    }
  }
}
</style>