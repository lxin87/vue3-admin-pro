<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { createRoleApi, updateRoleApi } from '@/api/role'

const visible = ref(false)
const title = ref('新增角色')
const ruleFormRef = ref<FormInstance>()

const formData = reactive({
  id: undefined,
  name: '',
  code: '',
  remark: '',
  status: 1
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色标识', trigger: 'blur' }]
}

const open = (row: any = {}) => {
  visible.value = true
  if (row.id) {
    title.value = '编辑角色'
    Object.assign(formData, row)
  } else {
    title.value = '新增角色'
    Object.assign(formData, { id: undefined, name: '', code: '', remark: '', status: 1 })
  }
}

const handleSubmit = async () => {
  await ruleFormRef.value?.validate()
  if (formData.id) {
    await updateRoleApi(formData.id, formData)
  } else {
    await createRoleApi(formData)
  }
  ElMessage.success('保存成功')
  visible.value = false
  emit('refresh') // 通知父组件刷新列表
}

const emit = defineEmits(['refresh'])
defineExpose({ open })
</script>

<template>
  <el-drawer v-model="visible" :title="title" size="400px">
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色标识" prop="code">
        <el-input v-model="formData.code" placeholder="请输入角色标识" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>