<template>
  <div class="dashboard-container">

    <el-card style="margin-bottom: 20px;">
      <template #header>
        <div class="header">
          <h2>欢迎使用集团数据概览系统</h2>
          <div class="time-selector">
            <el-radio-group
              v-model="timeRange"
              size="small"
            >
              <el-radio-button label="按年" />
              <el-radio-button label="按月" />
              <el-radio-button label="按周" />
              <el-radio-button label="按日" />
            </el-radio-group>
          </div>
        </div>
      </template>
      <!-- 顶部指标卡片 -->
      <el-row
        :gutter="20"
        class="metrics-row"
      >
        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-title">今日扩充物料</div>
              <div class="metric-value">80件</div>
              <div class="metric-compare">
                <span class="trend up">4.75%</span>
                <span>较昨日</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-title">累计完成率</div>
              <div class="metric-value">93%</div>
              <div class="progress-text">
                <span>累计已完成任务 1899件 / 累计任务 2000件</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-title">超期任务</div>
              <div class="metric-value">103件</div>
              <div class="metric-compare">
                <span class="trend up">4.75%</span>
                <span>较昨日</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="metric-card">
            <div class="metric-content">
              <div class="metric-title">预警任务</div>
              <div class="metric-value">90件</div>
              <div class="metric-compare">
                <span class="trend up">4.75%</span>
                <span>较昨日</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </el-card>

    <!-- 中部图表区域 -->
    <el-row
      :gutter="20"
      class="middle-charts"
    >
      <!-- 物料生命周期监控 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>物料生命周期监控</span>
              <el-radio-group
                v-model="lifecycleTimeRange"
                size="small"
              >
                <el-radio-button label="按年" />
                <el-radio-button label="按月" />
                <el-radio-button label="按周" />
                <el-radio-button label="按日" />
              </el-radio-group>
            </div>
          </template>
          <div class="lifecycle-metrics">
            <div class="lifecycle-item">
              <div class="lifecycle-value">1200个</div>
              <div class="lifecycle-label">编制状态</div>
            </div>
            <div class="lifecycle-item">
              <div class="lifecycle-value">800个</div>
              <div class="lifecycle-label">下达状态</div>
            </div>
            <div class="lifecycle-item">
              <div class="lifecycle-value">400个</div>
              <div class="lifecycle-label">完成状态</div>
            </div>
          </div>
          <div
            ref="lifecycleChart"
            class="chart-container"
          ></div>
        </el-card>
      </el-col>

      <!-- 未清物料类型分布 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>未清物料类型分布</span>
              <el-radio-group
                v-model="materialTypeTimeRange"
                size="small"
              >
                <el-radio-button label="按年" />
                <el-radio-button label="按月" />
                <el-radio-button label="按周" />
                <el-radio-button label="按日" />
              </el-radio-group>
            </div>
          </template>
          <div
            ref="materialTypeChart"
            class="chart-container"
          ></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部图表区域 -->
    <el-row
      :gutter="20"
      class="bottom-charts"
    >
      <!-- 左侧三个图表 -->
      <el-col :span="16">
        <el-row :gutter="20">
          <!-- 物料收集及时率 -->
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>物料收集及时率</span>
                  <el-radio-group
                    v-model="timelyRateTimeRange"
                    size="small"
                  >
                    <el-radio-button label="按年" />
                    <el-radio-button label="按月" />
                    <el-radio-button label="按周" />
                    <el-radio-button label="按日" />
                  </el-radio-group>
                </div>
              </template>
              <div
                ref="timelyRateChart"
                class="chart-container"
              ></div>
            </el-card>
          </el-col>

          <!-- 物料收集超期率 -->
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>物料收集超期率</span>
                  <el-radio-group
                    v-model="overdueRateTimeRange"
                    size="small"
                  >
                    <el-radio-button label="按年" />
                    <el-radio-button label="按月" />
                    <el-radio-button label="按周" />
                    <el-radio-button label="按日" />
                  </el-radio-group>
                </div>
              </template>
              <div
                ref="overdueRateChart"
                class="chart-container"
              ></div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 任务物料量排名Top 10 -->
        <el-card class="chart-card top-list-card">
          <template #header>
            <div class="chart-header">
              <span>任务物料量排名Top 10</span>
              <el-radio-group
                v-model="topListTimeRange"
                size="small"
              >
                <el-radio-button label="按年" />
                <el-radio-button label="按月" />
                <el-radio-button label="按周" />
                <el-radio-button label="按日" />
              </el-radio-group>
            </div>
          </template>
          <div
            ref="topListChart"
            class="chart-container"
          ></div>
        </el-card>
      </el-col>

      <!-- 右侧图表：物料收集字段完整率 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>物料收集字段完整率</span>
              <el-radio-group
                v-model="completenessTimeRange"
                size="small"
              >
                <el-radio-button label="按年" />
                <el-radio-button label="按月" />
                <el-radio-button label="按周" />
                <el-radio-button label="按日" />
              </el-radio-group>
            </div>
          </template>
          <div
            ref="completenessChart"
            class="chart-container"
          ></div>
        </el-card>
        <el-card class="chart-card top-list-card">
          <template #header>
            <div style="display: flex;align-items: center;justify-content: space-between;">
              <div class="card-title">系统公告</div>
              <div class="card-action">
                <el-button>查看全部</el-button>
              </div>
            </div>

          </template>
          <div class="notice-list">
            <div
              v-for="item in list"
              style="display: flex;align-items: center;justify-content: space-between;"
            >
              <span>{{ item.name }}</span>
              <span>{{ item.date }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 时间范围选择
const timeRange = ref('按日')
const lifecycleTimeRange = ref('按日')
const materialTypeTimeRange = ref('按日')
const timelyRateTimeRange = ref('按日')
const overdueRateTimeRange = ref('按日')
const topListTimeRange = ref('按日')
const completenessTimeRange = ref('按日')

// 图表引用
const lifecycleChart = ref(null)
const materialTypeChart = ref(null)
const timelyRateChart = ref(null)
const overdueRateChart = ref(null)
const topListChart = ref(null)
const completenessChart = ref(null)
const list = ref([
  {
    name: '徐工招聘公告',
    date: '2024-11-23'
  },
  {
    name: '徐工招聘公告',
    date: '2024-11-23'
  },
  {
    name: '徐工招聘公告',
    date: '2024-11-23'
  },
  {
    name: '徐工招聘公告',
    date: '2024-11-23'
  },
  {
    name: '徐工招聘公告',
    date: '2024-11-23'
  }
])
// 图表实例
let lifecycleChartInstance = null
let materialTypeChartInstance = null
let timelyRateChartInstance = null
let overdueRateChartInstance = null
let topListChartInstance = null
let completenessChartInstance = null

// 初始化图表
const initCharts = () => {
  // 物料生命周期监控图表
  if (lifecycleChart.value) {
    lifecycleChartInstance = echarts.init(lifecycleChart.value)
    const lifecycleOption = {
      tooltip: {
        trigger: 'item'
      },
      color: ['#5470c6', '#91cc75', '#fac858'],
      series: [
        {
          name: '物料生命周期',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          data: [
            { value: 1200, name: '编制状态' },
            { value: 800, name: '下达状态' },
            { value: 400, name: '完成状态' }
          ]
        }
      ]
    }
    lifecycleChartInstance.setOption(lifecycleOption)
  }

  // 未清物料类型分布图表
  if (materialTypeChart.value) {
    materialTypeChartInstance = echarts.init(materialTypeChart.value)
    const materialTypeOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['道路', '矿机', '基础', '挖机', '重型', '液压'],
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110],
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
        }
      ]
    }
    materialTypeChartInstance.setOption(materialTypeOption)
  }

  // 物料收集及时率图表
  if (timelyRateChart.value) {
    timelyRateChartInstance = echarts.init(timelyRateChart.value)
    const timelyRateOption = {
      tooltip: {
        trigger: 'axis'
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
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '及时率',
          type: 'line',
          smooth: true,
          data: [85, 88, 92, 94, 89, 93, 97],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
              { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
            ])
          },
          lineStyle: {
            width: 3,
            color: '#5470c6'
          }
        }
      ]
    }
    timelyRateChartInstance.setOption(timelyRateOption)
  }

  // 物料收集超期率图表
  if (overdueRateChart.value) {
    overdueRateChartInstance = echarts.init(overdueRateChart.value)
    const overdueRateOption = {
      tooltip: {
        trigger: 'axis'
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
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          name: '超期率',
          type: 'line',
          smooth: true,
          data: [15, 12, 8, 6, 11, 7, 3],
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(238, 102, 102, 0.5)' },
              { offset: 1, color: 'rgba(238, 102, 102, 0.1)' }
            ])
          },
          lineStyle: {
            width: 3,
            color: '#ee6666'
          }
        }
      ]
    }
    overdueRateChartInstance.setOption(overdueRateOption)
  }

  // 任务物料量排名Top 10图表
  if (topListChart.value) {
    topListChartInstance = echarts.init(topListChart.value)
    const topListOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: [
          'API 1',
          'API 2',
          'API 3',
          'API 4',
          'API 5',
          'API 6',
          'API 7',
          'API 8',
          'API 9',
          'API 10'
        ],
        axisLabel: {
          interval: 0
        }
      },
      series: [
        {
          name: '物料量',
          type: 'bar',
          data: [120, 100, 80, 75, 70, 50, 48, 40, 35, 30],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
        }
      ]
    }
    topListChartInstance.setOption(topListOption)
  }

  // 物料收集字段完整率图表
  if (completenessChart.value) {
    completenessChartInstance = echarts.init(completenessChart.value)
    const completenessOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
      color: ['#91cc75', '#ee6666'],
      series: [
        {
          name: '字段完整率',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['40%', '50%'],
          data: [
            { value: 85, name: '完整' },
            { value: 15, name: '不完整' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}: {d}%'
          }
        }
      ]
    }
    completenessChartInstance.setOption(completenessOption)
  }
}

// 调整图表大小
const resizeCharts = () => {
  lifecycleChartInstance && lifecycleChartInstance.resize()
  materialTypeChartInstance && materialTypeChartInstance.resize()
  timelyRateChartInstance && timelyRateChartInstance.resize()
  overdueRateChartInstance && overdueRateChartInstance.resize()
  topListChartInstance && topListChartInstance.resize()
  completenessChartInstance && completenessChartInstance.resize()
}

// 生命周期钩子
onMounted(() => {
  initCharts()
  window.addEventListener('resize', resizeCharts)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts)
  lifecycleChartInstance && lifecycleChartInstance.dispose()
  materialTypeChartInstance && materialTypeChartInstance.dispose()
  timelyRateChartInstance && timelyRateChartInstance.dispose()
  overdueRateChartInstance && overdueRateChartInstance.dispose()
  topListChartInstance && topListChartInstance.dispose()
  completenessChartInstance && completenessChartInstance.dispose()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  color: #303133;
  font-weight: 600;
  margin: 0;
}

.metrics-row {
  margin-bottom: 20px;
}

.metric-card {
  height: 120px;
}

.metric-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.metric-title {
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.metric-value {
  color: #303133;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.metric-compare {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.trend {
  margin-right: 5px;
}

.trend.up {
  color: #f56c6c;
}

.progress-text {
  font-size: 12px;
  color: #909399;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.lifecycle-metrics {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.lifecycle-item {
  text-align: center;
}

.lifecycle-value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.lifecycle-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.top-list-card .chart-container {
  height: 320px;
}
</style>