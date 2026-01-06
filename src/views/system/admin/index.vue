<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getAdminListApi, deleteAdminApi } from '@/api/admin'
import { formatTime } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminDrawer from './components/AdminDrawer.vue'
import ProTable from '@/components/ProTable/index.vue' // 引入组件
import type { ColumnProps } from '@/components/ProTable/interface' // 引入类型
import AdminRoleDialog from './components/AdminRoleDialog.vue'

// 获取 ProTable 实例 (用于调用 refresh)
const proTable = ref()
const drawerRef = ref()
const adminRoleDialogRef = ref()

// ==========================
// 1. 配置列 (核心)
// ==========================
const columns: ColumnProps[] = [
  { prop: 'id', label: 'ID', width: 80 },
  { 
    prop: 'username', 
    label: '登录账号', 
    search: { el: 'input', placeholder: '请输入账号' } // 开启搜索
  },
  { prop: 'name', label: '姓名' },
  { 
    prop: "roles", label: "所属角色"},
  { prop: 'status', label: '状态' ,width: 80}, // 稍后用插槽自定义显示
  { prop: 'created_at', label: '创建时间', width: 180 },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]

// ==========================
// 2. 页面逻辑 (只剩业务逻辑了，没有分页逻辑了！)
// ==========================

// 打开新增
const handleAdd = () => {
  drawerRef.value?.open('add')
}

// 打开编辑
const handleEdit = (row: any) => {
  drawerRef.value?.open('edit', row)
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除 ${row.name}?`, '提示', { type: 'warning' })
    .then(async () => {
      await deleteAdminApi(row.id)
      ElMessage.success('删除成功')
      // 刷新表格
      proTable.value?.refresh()
    })
}


</script>

<template>
  <div class="app-container">
    <ProTable 
      ref="proTable" 
      :request-api="getAdminListApi" 
      :columns="columns"
    >
      <template #toolButton>
        <el-button type="primary" :icon="Plus" @click="handleAdd" v-auth="'system:admin:add'">新增管理员</el-button>
      </template>

      <template #roles="scope">
      <div class="flex gap-1 flex-wrap">
        <el-tag 
          v-for="role in scope.row.roles" 
          :key="role.id" 
          type="success" 
          size="small"
        >
          {{ role.name }}
        </el-tag>
      </div>
    </template>

      <template #status="scope">
        <el-tag :type="scope.row.status ? 'success' : 'danger'">
          {{ scope.row.status ? '启用' : '禁用' }}
        </el-tag>
      </template>

      <template #created_at="scope">
        {{ formatTime(scope.row.created_at) }}
      </template>

      <template #operation="scope">
        <el-button link type="primary" @click="adminRoleDialogRef.open(scope.row.id)" v-auth="'sys:admin:assignRole'">分配角色</el-button>
        <el-button link type="primary" :icon="Edit" v-auth="'system:admin:edit'" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button link type="danger" :icon="Delete" v-auth="'system:admin:delete'" @click="handleDelete(scope.row)">删除</el-button>
      </template>

    </ProTable>

    <AdminDrawer ref="drawerRef" @success="proTable?.refresh()" />
    <AdminRoleDialog ref="adminRoleDialogRef" />
  </div>
</template>

<style scoped>
.app-container {
  height: 100%; /* 确保撑开高度 */
  padding: 20px;
}
</style>