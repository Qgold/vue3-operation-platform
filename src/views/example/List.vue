<template>
  <div class="list-container">
    <!-- 主标题 -->
    <h1 class="main-title">我是主标题</h1>

    <!-- 筛选查询区域 -->
    <div class="filter-card">
      <el-form
        ref="filterForm"
        :model="filterForm"
        label-width="auto"
        class="filter-form"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="筛选内容">
              <el-input
                v-model="filterForm.content1"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筛选内容">
              <el-input
                v-model="filterForm.content2"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称">
              <el-select
                v-model="filterForm.content3"
                placeholder="请选择"
              >
                <el-option
                  label="选项1"
                  value="1"
                />
                <el-option
                  label="选项2"
                  value="2"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="筛选内容222sdsdsd sd  d ">
              <el-input
                v-model="filterForm.content1"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筛选内容">
              <el-input
                v-model="filterForm.content2"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称">
              <el-select
                v-model="filterForm.content3"
                placeholder="请选择"
              >
                <el-option
                  label="选项1"
                  value="1"
                />
                <el-option
                  label="选项2"
                  value="2"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="filter-actions">
          <el-button
            type="text"
            @click="toggleFilter"
          >{{ isFilterCollapsed ? '展开' : '收起' }}</el-button>
          <el-button
            type="primary"
            @click="handleQuery"
          >
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon>
              <RefreshRight />
            </el-icon>
            重置
          </el-button>
        </div>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <el-button
        type="primary"
        icon="Plus"
      >
        <el-icon>
          <Plus />
        </el-icon>
        新建</el-button>
      <el-button icon="Upload">批量导入</el-button>
      <el-button icon="Download">下拉</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table-card">
      <el-table
        :data="tableData"
        border
      >
        <el-table-column
          prop="title1"
          label="Title"
        />
        <el-table-column
          prop="title2"
          label="Title"
        />
        <el-table-column
          prop="title3"
          label="Title"
        />
        <el-table-column
          prop="text1"
          label="Text"
        />
        <el-table-column
          prop="title4"
          label="Title"
        />
        <el-table-column
          prop="text2"
          label="Text"
        />
        <el-table-column
          prop="title5"
          label="Title"
        />
        <el-table-column
          prop="text3"
          label="Text"
        />
        <el-table-column
          label="操作"
          width="180"
        >
          <template #default>
            <el-button text>编辑</el-button>
            <el-button text>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :small="false"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="50"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, RefreshRight, Plus } from '@element-plus/icons-vue'
// 筛选表单数据
const filterForm = ref({
  content1: '',
  content2: '',
  content3: ''
})

// 表格数据
const tableData = ref([
  {
    title1: 'Title',
    title2: 'Title',
    title3: 'Title',
    text1: 'Text',
    title4: 'Title',
    text2: 'Text',
    title5: 'Title',
    text3: 'Text'
  }
  // 更多数据...
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(20)

// 筛选区域折叠状态
const isFilterCollapsed = ref(false)

// 查询
const handleQuery = () => {
  console.log('查询:', filterForm.value)
}

// 重置
const handleReset = () => {
  filterForm.value = {
    content1: '',
    content2: '',
    content3: ''
  }
}

// 切换筛选区域折叠状态
const toggleFilter = () => {
  isFilterCollapsed.value = !isFilterCollapsed.value
}

// 分页大小改变
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`)
  pageSize.value = val
}

// 当前页改变
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`)
  currentPage.value = val
}
</script>

<style scoped lang="less">
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background: var(--primary-color) !important;
  border: none !important;
  color: white !important;
}
:deep(.el-pagination.is-background .el-pager li) {
  background: white;
  border-color: var(--default-color) !important;
  color: var(--main-text-color) !important;
}
.list-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.main-title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
}

.filter-card {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line-color);
}

.filter-form {
  position: relative;
}

.filter-actions {
  text-align: right;
  margin-top: 10px;
}

.action-buttons {
  margin-bottom: 20px;
}

.table-card {
  width: 100%;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 确保el-col之间的间距为24px */
.el-row {
  margin-left: -12px !important;
  margin-right: -12px !important;
}

.el-col {
  padding-left: 12px !important;
  padding-right: 12px !important;
}
</style>