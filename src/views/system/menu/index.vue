<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteMenuApi, getMenuListApi,type MenuModel } from '@/api/menu'
import {Plus,Edit,Delete } from '@element-plus/icons-vue'
import MenuDrawer from './components/MenuDrawer.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const loading = ref(false)
const menuList = ref<MenuModel[]>([])

const getList = async () =>{
    loading.value = true
    try{
        const res = await getMenuListApi()
        menuList.value = res
    } finally{
        loading.value = false
    }
}
onMounted(()=>{
    getList()
})

const menuDrawerRef = ref()

/**
 * 统一处理打开抽屉的逻辑
 * @param type 操作类型
 * @param row 当前行数据（新增子项或编辑时需要）
 */
const handleOpenDrawer = (type: 'add' | 'edit', row?: any) => {
  // 现在我们把类型和数据都传给子组件
  menuDrawerRef.value.open(type, row)
}

const handleDelete = (row:MenuModel) =>{
    ElMessageBox.confirm(
    `确定要删除菜单【${row.title}】吗？`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try{
        await deleteMenuApi(row.id)
        ElMessage({
          type: 'success',
          message: '删除成功！'
        })
        getList()
    }catch(error:any){
        console.log(error)
    }
  })
}
</script>

<template>
  <div class="app-container">
    <el-card shadow="never">
        <div style="margin-bottom: 20px;">
            <el-button type="primary" :icon="Plus" v-auth="'sys:menu:store'" @click="handleOpenDrawer('add')">新增菜单</el-button>
        </div>
        
        <el-table
          v-loading="loading"
          :data="menuList"
          row-key="id"
          border
          :tree-props="{children:'children'}"
        >
            <el-table-column prop="title" label="菜单名称" min-width="150" />
            <el-table-column prop="icon" label="图标" width="80" align="center">
                <template #default="scope" size="18">
                    <el-icon v-if="scope.row.icon">
                        <component :is="scope.row.icon"></component>
                    </el-icon>
                </template>
            </el-table-column>
            <el-table-column prop="type" lable="类型" width="100" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.type === 1" type="success">目录</el-tag>
                    <el-tag v-else-if="scope.row.type === 2" type="primary">菜单</el-tag>
                    <el-tag v-else type="info">按钮</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="path" label="路由路径" />
            <el-table-column prop="component" label="组件地址" />
            <el-table-column prop="perm_code" label="权限标识" />
            <el-table-column prop="icon" label="是否隐藏" width="100" align="center">
                <template #default="scope">
                    <el-tag :type="scope.row.is_hidden === 0 ? 'success' : 'info'">
                        {{ scope.row.is_hidden === 0 ? '显示' : '隐藏' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="icon" label="状态" width="100" align="center">
                <template #default="scope">
                    <el-tag :type="scope.row.status === 0 ? 'success' : 'info'">
                        {{ scope.row.status === 0 ? '启用' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                    <el-button v-if="scope.row.type !== 3" link type="primary" v-auth="'sys:menu:store'" :icon="Plus" @click="handleOpenDrawer('add',scope.row)">
                        新增
                    </el-button>
                    <el-button link type="primary" :icon="Edit" v-auth="'sys:menu:update'" @click="handleOpenDrawer('edit',scope.row)">编辑</el-button>
                    <el-button link type="danger" :icon="Delete" v-auth="'sys:menu:destroy'" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <MenuDrawer ref="menuDrawerRef" @success="getList" />
  </div>
</template>

<style scoped lang="scss">

</style>