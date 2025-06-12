<template>
  <div class="operate-log">
    <div class="search-bar">
      <el-form :model="searchForm">
        <el-form-item label="操作类型">
          <el-select
            v-model="searchForm.operationType"
            placeholder="请选择操作类型"
          >
            <el-option
              label="全部"
              value=""
            />
            <el-option
              label="新增"
              value="create"
            />
            <el-option
              label="修改"
              value="update"
            />
            <el-option
              label="删除"
              value="delete"
            />
            <el-option
              label="查询"
              value="query"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作人">
          <el-input
            v-model="searchForm.operator"
            placeholder="请输入操作人"
          />
        </el-form-item>
        <el-form-item
          label="操作时间"
          style="width: 390px;"
        >
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item style="padding-left:80px;">
          <el-button
            type="primary"
            @click="handleSearch"
          >搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="logList"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column
        prop="operationType"
        label="操作类型"
        width="120"
      >
        <template #default="{ row }">
          <el-tag :type="getOperationTypeTag(row.operationType)">
            {{ getOperationTypeLabel(row.operationType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
        width="120"
      />
      <el-table-column
        prop="operationTime"
        label="操作时间"
        width="180"
      />
      <el-table-column
        prop="module"
        label="操作模块"
        width="120"
      />
      <el-table-column
        prop="description"
        label="操作描述"
      />
      <el-table-column
        prop="ip"
        label="IP地址"
        width="120"
      />
      <el-table-column
        label="操作"
        width="120"
      >
        <template #default="{ row }">
          <el-button
            text
            @click="showDetail(row)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="detailVisible"
      title="操作日志详情"
      width="50%"
    >
      <el-descriptions
        :column="2"
        border
      >
        <el-descriptions-item label="操作类型">{{ currentLog.operationType }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ currentLog.operator }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ currentLog.operationTime }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentLog.ip }}</el-descriptions-item>
        <el-descriptions-item label="操作模块">{{ currentLog.module }}</el-descriptions-item>
        <el-descriptions-item label="操作描述">{{ currentLog.description }}</el-descriptions-item>
        <el-descriptions-item
          label="请求参数"
          :span="2"
        >
          <pre>{{ formatJson(currentLog.requestParams) }}</pre>
        </el-descriptions-item>
        <el-descriptions-item
          label="响应结果"
          :span="2"
        >
          <pre>{{ formatJson(currentLog.responseResult) }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  operationType: '',
  operator: '',
  dateRange: []
})

const loading = ref(false)
const logList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailVisible = ref(false)
const currentLog = ref({})

// 获取日志列表
const getLogList = async () => {
  loading.value = true
  try {
    // TODO: 调用接口获取日志列表
    // 这里模拟一些数据
    logList.value = [
      {
        id: 1,
        operationType: 'create',
        operator: '张三',
        operationTime: '2025-05-13 10:00:00',
        module: '用户管理',
        description: '新增用户',
        ip: '192.168.1.1',
        requestParams: { name: '李四', age: 25 },
        responseResult: { code: 200, message: '成功' }
      }
    ]
    total.value = 100
  } catch (error) {
    ElMessage.error('获取日志列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getLogList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.operationType = ''
  searchForm.operator = ''
  searchForm.dateRange = []
  handleSearch()
}

// 分页大小改变
const handleSizeChange = (val) => {
  pageSize.value = val
  getLogList()
}

// 页码改变
const handleCurrentChange = (val) => {
  currentPage.value = val
  getLogList()
}

// 显示详情
const showDetail = (row) => {
  currentLog.value = row
  detailVisible.value = true
}

// 获取操作类型标签样式
const getOperationTypeTag = (type) => {
  const map = {
    create: 'success',
    update: 'warning',
    delete: 'danger',
    query: 'info'
  }
  return map[type] || 'info'
}

// 获取操作类型显示文本
const getOperationTypeLabel = (type) => {
  const map = {
    create: '新增',
    update: '修改',
    delete: '删除',
    query: '查询'
  }
  return map[type] || type
}

// 格式化 JSON
const formatJson = (json) => {
  try {
    return JSON.stringify(json, null, 2)
  } catch (error) {
    return json
  }
}

// 初始加载
getLogList()
</script>

<style scoped lang="less">
.operate-log {
  /* padding: 20px; */
}

.search-bar {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(pre) {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
:deep(.el-form-item__label) {
  width: 80px;
}
:deep(.el-button--text) {
  width: 50px !important;
}
:deep(.el-select) {
  --el-select-width: 312px !important;
}
</style>