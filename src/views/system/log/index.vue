<template>
  <div class="main-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getLogList"
      :tool-button="true"
    >
      <template #response_code="scope">
        <el-tag :type="scope.row.response_code >= 400 ? 'danger' : 'success'">
          {{ scope.row.response_code }}
        </el-tag>
      </template>

      <template #operation="scope">
        <el-button type="primary" link icon="View" @click="openDetail(scope.row)">详情</el-button>
      </template>
    </ProTable>

    <el-drawer v-model="drawerVisible" title="操作日志详情" size="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="操作人">{{ detailData.username }}</el-descriptions-item>
        <el-descriptions-item label="请求地址">
          <el-tag>{{ detailData.method }}</el-tag> {{ detailData.url }}
        </el-descriptions-item>
        <el-descriptions-item label="请求参数">
          <div class="json-box">{{ formatJson(detailData.params) }}</div>
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getLogListApi } from "@/api/log";

const proTable = ref();
const drawerVisible = ref(false);
const detailData = ref<any>({});

// 列表请求函数
const getLogList = (params: any) => {
  const newParams = { ...params };
  // 🚀 处理日期区间：ProTable 默认生成 createTime 数组
  if (newParams.createTime) {
    newParams.start_date = newParams.createTime[0];
    newParams.end_date = newParams.createTime[1];
    delete newParams.createTime;
  }
  return getLogListApi(newParams);
};

const columns:any[] = [
  { prop: "id", label: "ID", width: 80 },
  { prop: "username", label: "操作人", search: { el: "input" }, width: 120 },
  { 
    prop: "route_name", 
    label: "路由标识", 
    width: 150,
    search: { el: "input" } // 支持按路由名搜索
  },
  { prop: "method", label: "方式", width: 80 },
  { prop: "url", label: "请求地址", showOverflowTooltip: true },
  { prop: "response_code", label: "状态", width: 80 },
  { prop: "duration", label: "耗时(ms)", width: 100 },
  {
    prop: "created_at",
    label: "操作时间",
    // 临时移除 render，看看是不是 render 逻辑影响了 ProTable 对该列的识别
    // render: (scope: any) => scope.row.created_at, 
    search: {
      el: "date-picker",
      // 强制指定 key，防止 ProTable 内部由于 prop 冲突而不渲染表单
      key: "created_at", 
      props: {
        type: "daterange",
        valueFormat: "YYYY-MM-DD",
        // 增加以下属性确保渲染尺寸
        rangeSeparator: "-",
        startPlaceholder: "开始",
        endPlaceholder: "结束"
      }
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 100 }
];

const openDetail = (row: any) => {
  detailData.value = row;
  drawerVisible.value = true;
};

const formatJson = (val: string) => {
  try {
    return JSON.stringify(JSON.parse(val), null, 2);
  } catch (e) {
    return val;
  }
};
</script>

<style scoped>
.json-box {
  background: #282c34;
  color: #abb2bf;
  padding: 15px;
  font-family: monospace;
  white-space: pre-wrap;
  border-radius: 4px;
}
:deep(.el-range-editor.el-input__inner) {
  width: 100% !important;
  min-width: 240px;
}
:deep(.el-date-editor--daterange) {
  width: 100% !important;
}
</style>