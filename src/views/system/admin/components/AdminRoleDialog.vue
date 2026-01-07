<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getRoleListApi } from '@/api/role'
import { getAdminRoleIdsApi, assignAdminRolesApi } from '@/api/admin'

const visible = ref(false)
const loading = ref(false)
const adminId = ref<number>(0)
const roleIds = ref<number[]>([])
const allRoles = ref<any[]>([])

const open = async (id: number) => {
  adminId.value = id
  visible.value = true
  loading.value = true
  try {
    // 1. 拉取所有可选的角色列表 (启用状态的)
    const res = await getRoleListApi({ pageSize: 100, status: 1 })
    allRoles.value = res.data
    
    // 2. 拉取该管理员当前拥有的角色ID
    roleIds.value = await getAdminRoleIdsApi(id)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (adminId.value === 1 && roleIds.value.length === 0) {
     return ElMessage.warning('不能取消超级管理员的所有角色')
  }
  await assignAdminRolesApi(adminId.value, roleIds.value)
  ElMessage.success('角色分配成功')
  visible.value = false
}

defineExpose({ open })
</script>

<template>
  <el-dialog v-model="visible" title="分配角色" width="500px" append-to-body>
    <el-form v-loading="loading" label-width="80px">
      <el-form-item label="所属角色">
        <el-select v-model="roleIds" multiple placeholder="请选择角色" style="width: 100%">
          <el-option
            v-for="item in allRoles"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>