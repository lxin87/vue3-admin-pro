<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { createAdminApi,updateAdminApi, type CreateAdminParams } from '@/api/admin'

// 定义事件：成功提交后通知父组件刷新列表
const emit = defineEmits(['success'])

const visible = ref(false)
const isEdit = ref(false) // 标记当前是新增还是编辑
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const currentId = ref<number>(0)

// 表单数据默认值
const defaultFormData = {
  username: '',
  name: '',
  password: '',
  status: 1
}

// 响应式表单数据
const formData = reactive<CreateAdminParams>({ ...defaultFormData })

// 校验规则
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [
    // 只有新增模式下密码才必填，编辑模式如果不填则代表不修改
    { 
      validator: (rule: any, value: string, callback: any) => {
        if (!isEdit.value && !value) {
          callback(new Error('请输入密码'))
        } else if (value && value.length < 6) {
          callback(new Error('密码不能少于6位'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

// ==============================
// 暴露给父组件的方法
// ==============================
const open = (type: 'add' | 'edit', row?: any) => {
  visible.value = true
  isEdit.value = type === 'edit'
  
  // 重置表单
  if (formRef.value) formRef.value.resetFields()
  Object.assign(formData, defaultFormData)

  if (type === 'edit' && row) {
    // 如果是编辑，回显数据
    Object.assign(formData, {
      username: row.username,
      name: row.name,
      status: row.status ? 1 : 0,
      password: '' // 编辑时不显示原密码
    })
    // 这里建议存一下 row.id，后续调用更新接口要用
    currentId.value = row.id
  }
}

// 暴露 open 方法
defineExpose({
  open
})

// ==============================
// 内部逻辑
// ==============================
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value) {
          await updateAdminApi(currentId.value, formData)
          ElMessage.warning('编辑成功')
        } else {
          // 调用新增接口
          await createAdminApi(formData)
          ElMessage.success('创建成功')
        }
        
        visible.value = false
        emit('success') // 通知父组件刷新
      } finally {
        submitLoading.value = false
      }
    }
  })
}
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="isEdit ? '编辑管理员' : '新增管理员'"
    direction="rtl"
    size="500px"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="账号" prop="username">
        <el-input 
          v-model="formData.username" 
          placeholder="请输入登录账号" 
          :disabled="isEdit"
        />
      </el-form-item>
      
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名" />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input 
          v-model="formData.password" 
          type="password" 
          :placeholder="isEdit ? '留空则不修改密码' : '请输入密码'" 
          show-password
        />
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :value="1">启用</el-radio>
          <el-radio :value="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div style="flex: auto">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确认
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>