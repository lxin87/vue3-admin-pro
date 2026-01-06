<script setup lang="ts">
import { ref } from 'vue'
import ProTable from '@/components/ProTable/index.vue'
import { deleteRoleApi,updateRoleStatusApi,getRoleListApi } from '@/api/role';
import PermissionDrawer from './components/PermissionDrawer.vue';
import RoleDrawer from './components/RoleDrawer.vue';
import { ElMessage,ElMessageBox } from 'element-plus';
import {Setting,Plus,Edit,Delete} from '@element-plus/icons-vue'
import type { ColumnProps } from '@/components/ProTable/interface';
import { formatTime } from '@/utils/format';

const tableRef = ref()
const permissionDrawerRef = ref()
const roleDrawerRef = ref()

// 列配置
const columns:ColumnProps[] = [
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: '角色名称', search: { el: 'input' } },
  { prop: 'code', label: '角色标识', search: { el: 'input' } },
  { prop: 'remark', label: '备注' },
  { prop: 'status', label: '状态' },
  { prop: 'created_at', label: '创建时间', width: 180 },
  { prop: 'operation', label: '操作', width: 250, fixed: 'right' }
]

const handleStatusChange = async (row:any) =>{
  // 【关键守卫】：如果 id 不存在，说明是初始化触发或异常触发，直接拦截
  if (!row || !row.id) return;
  try{
    await updateRoleStatusApi(row.id,row.status)
    ElMessage.success('更新成功')
  }catch{
    row.status = row.status === 1 ? 0 : 1 // 失败回滚
  }
}
//权限分配 
const handleAssign = (row:any) =>{
  permissionDrawerRef.value.open(row.id)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除角色【${row.name}】吗？`, '提示', { type: 'warning' }).then(async () => {
    await deleteRoleApi(row.id)
    ElMessage.success('删除成功')
    tableRef.value.refresh()
  })
}
</script>

<template>
  <div class="app-container">
    
    <ProTable
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :request-api="getRoleListApi"
    >
      <template #toolButton>
        <el-button type="primary" :icon="Plus" v-auth="'sys:role:add'" @click="roleDrawerRef.open()">
          新增角色
        </el-button>
      </template>
      <template #status="scope">
        
        <el-switch
          v-model="scope.row.status"
          :active-value="1"
          :inactive-value="0"
          @change="handleStatusChange(scope.row)"
        />
      </template>

      <template #created_at="scope">
        
        {{ formatTime(scope.row.created_at) }}
      </template>

      <template #operation="scope">
        <el-button link type="primary" :icon="Setting" v-auth="'sys:role:assignPermission'" @click="handleAssign(scope.row)">分配权限</el-button>
        <el-button link type="primary" :icon="Edit" v-auth="'sys:role:edit'" @click="roleDrawerRef.open(scope.row)">编辑</el-button>
        <el-button v-if="scope.row.id !== 1" link type="danger" :icon="Delete" v-auth="'sys:role:delete'" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </ProTable>

    <PermissionDrawer ref="permissionDrawerRef" />
    <RoleDrawer ref="roleDrawerRef" @refresh="tableRef.refresh()" />
  </div>
</template>

<style scoped lang="scss">

</style>