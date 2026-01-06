<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, type ElTree } from 'element-plus';
import { getMenuTreeApi, type MenuModel } from '@/api/menu';
import { getRoleMenuIdsApi,assignRoleMenuApi } from '@/api/role';

const visible = ref(false)
const loading = ref(false)
const menuData = ref<MenuModel[]>([])
const roleId = ref<number>(0)
const treeRef = ref<InstanceType<typeof ElTree>>()

const open = async (id:number) => {
  roleId.value = id
  visible.value = true 
  loading.value = true 
  try {
    //1.全量菜单树
    const menus = await getMenuTreeApi()
    menuData.value = menus
    //2.获取该角色已有的权限id
    const allCheckedKeys = await getRoleMenuIdsApi(id)
    //3.设置选中状态(注意：setCheckedKeys 会自动处理父子关联)
    const leafKeys = filterLeafKeys(menus, allCheckedKeys)
    // 这里的逻辑在后面还要优化“半选”问题，目前先简单实现
    setTimeout(()=>{
      treeRef.value?.setCheckedKeys(leafKeys)
    },100)

  } finally{
    loading.value = false
  }
}

/**
 * 过滤出叶子节点的 ID
 * @param allMenus 全量菜单树
 * @param checkedKeys 后端返回的所有已选 ID（包含父节点）
 */
const filterLeafKeys = (allMenus: any[], checkedKeys: number[]): number[] => {
  const leafKeys: number[] = []
  
  const finder = (nodes: any[]) => {
    nodes.forEach(node => {
      // 如果没有子节点，说明是叶子节点
      if (!node.children || node.children.length === 0) {
        if (checkedKeys.includes(node.id)) {
          leafKeys.push(node.id)
        }
      } else {
        // 如果有子节点，继续递归向下找
        finder(node.children)
      }
    })
  }
  
  finder(allMenus)
  return leafKeys
}

const handleSubmit = async() =>{
  //获取当前选中节点的ID数组
  const checkedKeys = treeRef.value?.getCheckedKeys() as number[]
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() as number[]

  // 合并全选和半选，防止后端菜单树断层
  const allKeys = [...checkedKeys,...halfCheckedKeys]
  try{
    await assignRoleMenuApi(roleId.value,{menu_ids:allKeys})
    ElMessage.success('权限分配成功')
    visible.value =false
  }catch(err){
    console.log(err)
  }
}

defineExpose({open})
</script>

<template>
  <el-drawer v-model="visible" title="分配角色权限" size="400px">
    <div v-loading="loading">
      <el-tree
        ref="treeRef"
        :data="menuData"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="{ label: 'title', children: 'children' }"
      />
    </div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定保存</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">

</style>