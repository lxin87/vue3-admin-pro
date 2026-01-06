<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import type { ColumnProps, Pageable } from './interface'

// =======================
// Props 定义
// =======================
interface ProTableProps {
  columns: ColumnProps[];      // 列配置
  requestApi: (params: any) => Promise<any>; // 请求接口
  initParam?: any;             // 初始化额外参数 (可选)
  dataCallback?: (data: any) => any; // 数据转换钩子 (可选)
}

// 给 props 设置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  initParam: () => ({}),
})

// =======================
// 内部状态
// =======================
const tableData = ref<any[]>([])
const loading = ref(false)
const pageable = reactive<Pageable>({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 搜索参数 (从 columns 里提取 search 配置，暂时先做个简单的 input 绑定)
// 进阶版应该单独封装 SearchForm 组件，这里为了教学先简化，用一个对象存
const searchParam = reactive<any>({})
 
// =======================
// 核心逻辑
// =======================

/**
 * 获取表格数据
 */
const getTableList = async () => {
  try {
    loading.value = true
    
    // 1. 组装参数：分页 + 搜索 + 初始化参数
    const params = {
      page: pageable.pageNum,
      pageSize: pageable.pageSize,
      ...props.initParam,
      ...searchParam // 自动带上搜索框的数据
    }

    // 2. 调用 API
    const res = await props.requestApi(params)
    
    // 3. 处理回调 (有的接口可能需要二次处理数据)
    const data = props.dataCallback ? props.dataCallback(res) : res
    
    // 4. 赋值
    tableData.value = data.data // 假设后端返回结构里 data 是列表
    pageable.total = data.total
    
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

/**
 * 搜索
 */
const search = () => {
  pageable.pageNum = 1
  getTableList()
}

/**
 * 重置
 */
const reset = () => {
  pageable.pageNum = 1
  // 清空搜索参数
  for (const key in searchParam) {
    searchParam[key] = ''
  }
  getTableList()
}

/**
 * 分页改变
 */
const handleSizeChange = (val: number) => {
  pageable.pageSize = val
  getTableList()
}
const handleCurrentChange = (val: number) => {
  pageable.pageNum = val
  getTableList()
}

// 暴露给父组件的方法
defineExpose({
  refresh: getTableList, // 刷新表格
  tableData              // 当前数据
})

// 初始化加载
onMounted(() => {
  // 初始化 searchParam
  props.columns.forEach(item => {
    if (item.search) {
      searchParam[item.prop] = ''
    }
  })
  getTableList()
})
</script>

<template>
  <div class="pro-table-container">
    <el-card shadow="never" class="search-card" v-if="columns.some(c => c.search)">
      <el-form :inline="true" :model="searchParam">
        <template v-for="item in columns" :key="item.prop">
          <el-form-item v-if="item.search" :label="item.label">
            <el-input 
              v-if="item.search.el === 'input' || !item.search.el"
              v-model="searchParam[item.prop]" 
              :placeholder="item.search.placeholder || `请输入${item.label}`"
              clearable
              @keyup.enter="search"
            />
            </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
          <el-button :icon="Refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <div class="table-header">
        <slot name="toolButton"></slot>
      </div>

      <el-table 
        v-loading="loading" 
        :data="tableData" 
        border 
        stripe 
        style="width: 100%"
      >
        <template v-for="item in columns" :key="item.prop">
          
          <el-table-column 
            v-bind="item" 
            :align="item.align || 'center'"
          >
            <template #default="scope">
              <slot :name="item.prop" :row="scope.row">
                {{ scope.row[item.prop] }}
              </slot>
            </template>
          </el-table-column>

        </template>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pageable.pageNum"
          v-model:page-size="pageable.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pageable.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.pro-table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  .search-card {
    margin-bottom: 10px;
  }
  
  .table-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .table-header {
      margin-bottom: 15px;
    }
    
    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>