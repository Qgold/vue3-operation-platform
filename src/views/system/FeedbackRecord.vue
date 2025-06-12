<template>
  <div class="feedback-record-container">
    <!-- 搜索筛选区 -->
    <div class="search-area mb-4 p-4 bg-white rounded ">
      <el-form :model="searchForm">
        <el-form-item label="反馈人">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入反馈人姓名"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="反馈日期"
          style="width: 392px;"
        >
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
          />
        </el-form-item>
        <el-form-item class="ml-20">
          <el-button
            type="primary"
            @click="handleSearch"
          >
            <!-- <el-icon>
              <Search />
            </el-icon> -->
            搜索
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 列表区域 -->
    <div class="list-area bg-white p-4 rounded">
      <el-table
        :data="feedbackList"
        border
        stripe
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80"
        />
        <el-table-column
          prop="name"
          label="反馈人"
          width="120"
        />
        <el-table-column
          prop="type"
          label="反馈类型"
          width="120"
        >
          <template #default="{ row }">
            <el-tag :type="getTagType(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="反馈内容"
          show-overflow-tooltip
        />
        <el-table-column
          prop="status"
          label="状态"
          width="100"
        >
          <template #default="{ row }">
            <el-tag :type="row.status === '已处理' ? 'success' : 'warning'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="反馈时间"
          width="180"
        />
        <el-table-column
          label="操作"
          width="100"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              link
              text
              @click="showDetail(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="反馈详情"
      width="600px"
    >
      <template v-if="currentDetail">
        <div class="detail-content">
          <div class="detail-item mb-4">
            <div class="label">反馈人：</div>
            <div class="value">{{ currentDetail.name }}</div>
          </div>
          <div class="detail-item mb-4">
            <div class="label">反馈类型：</div>
            <div class="value">
              <el-tag :type="getTagType(currentDetail.type)">
                {{ currentDetail.type }}
              </el-tag>
            </div>
          </div>
          <div class="detail-item mb-4">
            <div class="label">反馈内容：</div>
            <div class="value">{{ currentDetail.content }}</div>
          </div>
          <div class="detail-item mb-4">
            <div class="label">反馈时间：</div>
            <div class="value">{{ currentDetail.createTime }}</div>
          </div>
          <div class="detail-item mb-4">
            <div class="label">处理状态：</div>
            <div class="value">
              <el-tag :type="currentDetail.status === '已处理' ? 'success' : 'warning'">
                {{ currentDetail.status }}
              </el-tag>
            </div>
          </div>
          <div
            class="detail-item mb-4"
            v-if="currentDetail.reply"
          >
            <div class="label">处理回复：</div>
            <div class="value">{{ currentDetail.reply }}</div>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  name: '',
  dateRange: []
})

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 列表数据
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const feedbackList = ref([])

// 获取模拟数据
const fetchData = async () => {
  loading.value = true
  try {
    // TODO: 替换为实际的API调用
    const mockData = Array.from({ length: 55 }, (_, index) => ({
      id: index + 1,
      name: `用户${index + 1}`,
      type: ['功能建议', '性能问题', 'BUG反馈', '其他'][index % 4],
      content: `这是第${index + 1}条反馈内容，描述了用户遇到的问题或建议...`,
      status: index % 3 === 0 ? '待处理' : '已处理',
      createTime: new Date(
        Date.now() - index * 24 * 3600 * 1000
      ).toLocaleString(),
      reply: index % 3 === 0 ? '' : '感谢您的反馈，我们会认真处理...'
    }))

    // 模拟筛选
    let filteredData = mockData.filter((item) => {
      if (searchForm.name && !item.name.includes(searchForm.name)) {
        return false
      }
      if (searchForm.dateRange?.length === 2) {
        const itemDate = new Date(item.createTime)
        const startDate = searchForm.dateRange[0]
        const endDate = searchForm.dateRange[1]
        if (itemDate < startDate || itemDate > endDate) {
          return false
        }
      }
      return true
    })

    total.value = filteredData.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    feedbackList.value = filteredData.slice(start, end)
  } finally {
    loading.value = false
  }
}

// 搜索和重置
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const resetSearch = () => {
  searchForm.name = ''
  searchForm.dateRange = []
  handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchData()
}

// 详情弹窗
const dialogVisible = ref(false)
const currentDetail = ref(null)

const showDetail = (row) => {
  currentDetail.value = row
  dialogVisible.value = true
}

// 获取标签类型
const getTagType = (type) => {
  const typeMap = {
    功能建议: 'success',
    性能问题: 'warning',
    BUG反馈: 'danger',
    其他: 'info'
  }
  return typeMap[type] || 'info'
}

// 初始化
fetchData()
</script>

<style scoped lang="less">
.feedback-record-container {
  .search-area {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .list-area {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .detail-content {
    .detail-item {
      display: flex;
      align-items: flex-start;

      .label {
        width: 100px;
        color: #606266;
        padding-right: 12px;
      }

      .value {
        flex: 1;
      }
    }
  }
  :deep(.el-form-item__label) {
    width: 80px;
  }
}
</style>