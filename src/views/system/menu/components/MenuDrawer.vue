<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage,type FormInstance } from 'element-plus';
import { createMenuApi,getMenuTreeApi ,updateMenuApi,type MenuModel } from '@/api/menu'; 
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const emit = defineEmits(['success'])

const visible = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const MenuOptions = ref<MenuModel[]>([])
const currentId = ref<number | null >(null)
const isEdit = ref(false)

const formData = reactive<Partial<MenuModel>>({
    parent_id: 0,
    title: '',
    icon: '',
    path: '',
    component: '',
    perm_code: '',
    type: 1,
    sort: 0,
    is_hidden:0,
    status: 1
})

const rules = {
    title: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
    ],
    path: [
      { required: true, message: '请输入菜单路径', trigger: 'blur' },
    ],
    component: [
      { required: true, message: '请输入菜单组件', trigger: 'blur' },
    ],
}

const open = async (type :'add'|'edit', row?:MenuModel) =>{
    visible.value = true
    isEdit.value = type === 'edit'
    
    //重置表单
    if(formRef.value) formRef.value.resetFields()
    if(type === 'add'){
      currentId.value = null
      Object.assign(formData, { parent_id: row?.parent_id ?? 0, title: '', type: 1, icon: '', path: '', component: '', perm_code: '', sort: 0, status: 0 })
      if(row){
        formData.parent_id = row.id
        // 自动推断类型：父级是目录(1)则子级默认是菜单(2)；父级是菜单(2)则子级默认是按钮(3)
        formData.type = row.type === 1 ? 2 : (row.type === 2 ? 3 : 3)

        //限制层级
        if(row.type === 3){
          return ElMessage.warning('按钮类型不能添加下级菜单')
        }
      }
    }
    else{
      currentId.value = row?.id || null
      Object.assign(formData, row)
    }
    
    
    const res = await getMenuTreeApi()
    MenuOptions.value = [
        { id:0, title: '顶级菜单',children: res } as any,
    ]
    if (isEdit.value) {
      handleDisableNodes(MenuOptions.value, currentId.value!)
    }

    
}
/**
 * 递归禁用当前节点及其所有子节点
 */
const handleDisableNodes = (nodes: any[], targetId: number) => {
  nodes.forEach(node => {
    if (node.id === targetId) {
      node.disabled = true // 禁用自己
      // 如果有子集，也全部禁用
      if (node.children) {
        disableAllChildren(node.children)
      }
    } else if (node.children) {
      handleDisableNodes(node.children, targetId)
    }
  })
}

const disableAllChildren = (nodes: any[]) => {
  nodes.forEach(node => {
    node.disabled = true
    if (node.children) disableAllChildren(node.children)
  })
}
defineExpose({ open })

const handleSubmit = async() =>{
    if(!formRef.value) return 
    await formRef.value.validate(async (valid) =>{
        if(valid){
          /* * TODO: 菜单层级合法性校验优化
            * 1. 检查选中的 parent_id 对应的节点类型。
            * 2. 如果父节点是【按钮】，则禁止选择（目前已在下拉树禁用逻辑中部分实现）。
            * 3. 如果当前节点是【目录】，则父节点必须是【顶级】或【目录】。
            * 4. 如果当前节点是【菜单】，则父节点必须是【目录】。
            */
            submitLoading.value = true
            try{
              if(isEdit.value && currentId.value) {
                await updateMenuApi(currentId.value, formData)
                ElMessage.success('修改成功')
              }
              else{
                await createMenuApi(formData)
                ElMessage.success('新增成功')
              }
              visible.value = false
              emit('success')
            }finally{
              submitLoading.value = false
            }
        }
    })
}
</script>

<template>
  <el-drawer v-model="visible" title="新增菜单" size="580px">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="上级菜单">
        <el-tree-select
          v-model="formData.parent_id"
          :data="MenuOptions"
          :props="{ label: 'title', value: 'id', children: 'children' }"
          check-strictly
          placeholder="请选择上级菜单"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="菜单类型">
        <el-radio-group v-model="formData.type">
          <el-radio :value="1">目录</el-radio>
          <el-radio :value="2">菜单</el-radio>
          <el-radio :value="3">按钮</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="formData.title" placeholder="请输入菜单名称" />
      </el-form-item>

      <el-form-item v-if="formData.type !== 3" label="菜单图标">
        <el-select v-model="formData.icon" placeholder="选择图标" clearable style="width: 100%">
          <el-option v-for="(item, key) in ElementPlusIconsVue" :key="key" :label="key" :value="key">
            <div style="display: flex; align-items: center">
              <el-icon><component :is="item" /></el-icon>
              <span style="margin-left: 10px">{{ key }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.type !== 3" label="路由路径" prop="path">
        <el-input v-model="formData.path" placeholder="如: user" />
      </el-form-item>

      <el-form-item v-if="formData.type === 2" label="组件路径" prop="component">
        <el-input v-model="formData.component" placeholder="如: system/user/index" />
      </el-form-item>

      <el-form-item v-if="formData.type !== 1" label="权限标识">
        <el-input v-model="formData.perm_code" placeholder="如: sys:user:add" />
      </el-form-item>

      <el-form-item label="显示排序">
        <el-input-number v-model="formData.sort" :min="0" />
      </el-form-item>
      <el-form-item label="是否隐藏" prop="is_hidden">
        <el-radio-group v-model="formData.is_hidden">
          <el-radio :value="0">显示</el-radio>
          <el-radio :value="1">隐藏</el-radio>
        </el-radio-group>
        <div class="help-tips">设置为隐藏后，该权限仍可分配，但不会出现在侧边栏</div>
      </el-form-item>

      <el-form-item label="菜单状态">
        <el-radio-group v-model="formData.status">
          <el-radio :value="0">启用</el-radio>
          <el-radio :value="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确认</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">

</style>