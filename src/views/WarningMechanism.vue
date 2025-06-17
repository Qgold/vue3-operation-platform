<template>
  <div class="warning-mechanism">
    <div class="warning-header">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="warning-card">
            <div class="card-content">
              <div class="card-title">今日告警</div>
              <div class="card-number">{{ todayWarnings }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="warning-card">
            <div class="card-content">
              <div class="card-title">待处理告警</div>
              <div class="card-number warning">{{ pendingWarnings }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="warning-card">
            <div class="card-content">
              <div class="card-title">已处理告警</div>
              <div class="card-number success">{{ handledWarnings }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="warning-card">
            <div class="card-content">
              <div class="card-title">告警规则数</div>
              <div class="card-number info">{{ ruleCount }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="warning-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="告警记录"
          name="records"
        >
          <div class="warn-chart-container">
            <div
              ref="chartRef"
              class="warning-chart"
            ></div>
          </div>
          <el-table
            :data="warningRecords"
            style="width: 100%"
          >
            <el-table-column
              prop="ruleName"
              label="规则名称"
            />
            <el-table-column
              prop="type"
              label="告警类型"
            />
            <el-table-column
              prop="value"
              label="触发值"
            />
            <el-table-column
              prop="time"
              label="告警时间"
            />
            <el-table-column
              prop="status"
              label="状态"
            >
              <template #default="{ row }">
                <el-tag :type="row.status === '已处理' ? 'success' : 'danger'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120"
            >
              <template #default="{ row }">
                <el-button
                  link
                  text
                  :disabled="row.status === '已处理'"
                  @click="handleWarning(row)"
                >处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="告警规则"
          name="rules"
        >
          <div class="action-bar">
            <el-button
              type="primary"
              @click="showRuleDialog"
            >新增规则</el-button>
          </div>
          <el-table
            :data="rules"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="规则名称"
            />
            <el-table-column
              prop="type"
              label="监控类型"
            >
              <template #default="{ row }">
                <el-tag>{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="threshold"
              label="阈值"
            />
            <el-table-column
              prop="operator"
              label="触发条件"
            />
            <el-table-column
              prop="status"
              label="状态"
            >
              <template #default="{ row }">
                <el-switch
                  v-model="row.status"
                  :active-value="true"
                  :inactive-value="false"
                  @change="handleStatusChange(row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200"
            >
              <template #default="{ row }">
                <el-button
                  text
                  size="small"
                  @click="editRule(row)"
                >编辑</el-button>
                <el-button
                  text
                  size="small"
                  class="delete-btn"
                  @click="deleteRule(row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </div>

    <el-dialog
      v-model="ruleDialogVisible"
      :title="editingRule ? '编辑规则' : '新增规则'"
      width="400px"
    >
      <el-form
        :model="ruleForm"
        label-width="100px"
      >
        <el-form-item
          label="规则名称"
          class="w-[312px]"
        >
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入规则名称"
          />
        </el-form-item>
        <el-form-item
          label="监控类型"
          class="w-[312px]"
        >
          <el-select
            v-model="ruleForm.type"
            placeholder="请选择监控类型"
          >
            <el-option
              label="库存"
              value="inventory"
            />
            <el-option
              label="流量"
              value="traffic"
            />
            <el-option
              label="CPU"
              value="cpu"
            />
            <el-option
              label="内存"
              value="memory"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="阈值">
          <el-input-number
            v-model="ruleForm.threshold"
            :min="0"
          />
        </el-form-item>
        <el-form-item
          label="触发条件"
          class="w-[312px]"
        >
          <el-select
            v-model="ruleForm.operator"
            placeholder="请选择触发条件"
          >
            <el-option
              label="大于"
              value=">"
            />
            <el-option
              label="小于"
              value="<"
            />
            <el-option
              label="等于"
              value="="
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ruleDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="saveRule"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
const style = getComputedStyle(document.documentElement)
const getThemeColor = (varName) => style.getPropertyValue(varName).trim()

const activeTab = ref('records')
const chartRef = ref(null)
let chart = null

// 统计数据
const todayWarnings = ref(15)
const pendingWarnings = ref(5)
const handledWarnings = ref(10)
const ruleCount = ref(8)

// 规则相关
const rules = ref([
  {
    id: 1,
    name: '库存不足告警',
    type: '库存',
    threshold: 100,
    operator: '<',
    status: true
  },
  {
    id: 2,
    name: '异常流量告警',
    type: '流量',
    threshold: 1000,
    operator: '>',
    status: true
  }
])

const ruleDialogVisible = ref(false)
const editingRule = ref(null)
const ruleForm = reactive({
  name: '',
  type: '',
  threshold: 0,
  operator: ''
})

// 告警记录
const warningRecords = ref([
  {
    id: 1,
    ruleName: '库存不足告警',
    type: '库存',
    value: 50,
    time: '2025-05-13 10:00:00',
    status: '待处理'
  },
  {
    id: 2,
    ruleName: '异常流量告警',
    type: '流量',
    value: 1500,
    time: '2025-05-13 09:30:00',
    status: '已处理'
  }
])

// 显示规则dialog
const showRuleDialog = () => {
  editingRule.value = null
  ruleForm.name = ''
  ruleForm.type = ''
  ruleForm.threshold = 0
  ruleForm.operator = ''
  ruleDialogVisible.value = true
}

// 编辑规则
const editRule = (row) => {
  editingRule.value = row
  ruleForm.name = row.name
  ruleForm.type = row.type
  ruleForm.threshold = row.threshold
  ruleForm.operator = row.operator
  ruleDialogVisible.value = true
}

// 删除规则
const deleteRule = (row) => {
  ElMessageBox.confirm('确定要删除该规则吗？', '提示', {
    type: 'warning'
  }).then(() => {
    rules.value = rules.value.filter((item) => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

// 保存规则
const saveRule = () => {
  if (
    !ruleForm.name ||
    !ruleForm.type ||
    !ruleForm.threshold ||
    !ruleForm.operator
  ) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (editingRule.value) {
    // 编辑
    const index = rules.value.findIndex(
      (item) => item.id === editingRule.value.id
    )
    if (index !== -1) {
      rules.value[index] = {
        ...editingRule.value,
        ...ruleForm
      }
    }
  } else {
    // 新增
    rules.value.push({
      id: Date.now(),
      ...ruleForm,
      status: true
    })
  }

  ruleDialogVisible.value = false
  ElMessage.success(editingRule.value ? '修改成功' : '添加成功')
}

// 处理告警
const handleWarning = (row) => {
  ElMessageBox.confirm('确定要将该告警标记为已处理吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    row.status = '已处理'
    ElMessage.success('处理成功')
  })
}

// 规则状态改变
const handleStatusChange = (row) => {
  ElMessage.success(`${row.name}已${row.status ? '启用' : '停用'}`)
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value, null, {})
  const option = {
    title: {
      text: '近7天告警趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['库存告警', '流量告警', 'CPU告警', '内存告警']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['5-7', '5-8', '5-9', '5-10', '5-11', '5-12', '5-13']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '库存告警',
        type: 'line',
        data: [3, 5, 2, 7, 4, 6, 8],
        itemStyle: {
          color: getThemeColor('--chart-color-1')
        }
      },
      {
        name: '流量告警',
        type: 'line',
        data: [2, 3, 4, 2, 5, 3, 4],
        itemStyle: {
          color: getThemeColor('--chart-color-2')
        }
      },
      {
        name: 'CPU告警',
        type: 'line',
        data: [1, 2, 1, 3, 2, 4, 2],
        itemStyle: {
          color: getThemeColor('--chart-color-3')
        }
      },
      {
        name: '内存告警',
        type: 'line',
        data: [2, 1, 3, 2, 4, 1, 3],
        itemStyle: {
          color: getThemeColor('--chart-color-4')
        }
      }
    ]
  }

  chart.setOption(option)
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
  chart?.resize()
})

onMounted(() => {
  initChart()
})
</script>

<style scoped lang="less">
.warning-mechanism {
}

.warning-header {
  margin-bottom: 20px;
}

.warning-card {
  .card-content {
    text-align: center;

    .card-title {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }

    .card-number {
      font-size: 24px;
      font-weight: bold;
      color: var(--primary-color);

      &.warning {
        color: #e6a23c;
      }

      &.success {
        color: #67c23a;
      }

      &.info {
        color: #909399;
      }
    }
  }
}

.warning-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;

  .action-bar {
    margin-bottom: 20px;
    text-align: left;
  }
}

.warn-chart-container {
  padding-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  //   flex: 1;

  .warning-chart {
    flex: 1;
    width: 100%;
    height: 400px;
    // min-width: 0; /* 防止子元素溢出 */
  }
}

.delete-btn {
  color: #f56c6c;
}
</style>