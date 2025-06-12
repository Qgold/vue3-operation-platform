<template>
  <div class="trend-analysis-container">
    <!-- 历史数据对比 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>历史数据对比</span>
          <el-radio-group
            v-model="timeRange"
            size="small"
          >
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div
        ref="historyChart"
        class="chart"
      ></div>
    </el-card>

    <!-- 漏斗分析和留存率 -->
    <el-row
      :gutter="20"
      class="mt-4"
    >
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>转化漏斗分析</span>
              <el-select
                v-model="funnelType"
                size="small"
                style="width: 120px"
              >
                <el-option
                  label="注册流程"
                  value="register"
                />
                <el-option
                  label="购买流程"
                  value="purchase"
                />
              </el-select>
            </div>
          </template>
          <div
            ref="funnelChart"
            class="chart"
          ></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户留存分析</span>
              <el-tooltip
                content="统计用户在一段时间内的留存情况"
                placement="top"
              >
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <div
            ref="retentionChart"
            class="chart"
          ></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { QuestionFilled } from '@element-plus/icons-vue'

const timeRange = ref('month')
const funnelType = ref('register')
const historyChart = ref(null)
const funnelChart = ref(null)
const retentionChart = ref(null)
const charts = []

// 初始化历史数据对比图表
const initHistoryChart = () => {
  const chart = echarts.init(historyChart.value)
  charts.push(chart)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['2024年', '2025年']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '2024年',
        type: 'bar',
        data: [320, 332, 301, 334, 390, 330],
        itemStyle: {
          color: '#91cc75'
        }
      },
      {
        name: '2025年',
        type: 'bar',
        data: [350, 382, 391, 434, 420, 380],
        itemStyle: {
          color: '#5470c6'
        }
      }
    ]
  }

  chart.setOption(option)
}

// 初始化漏斗图
const initFunnelChart = () => {
  const chart = echarts.init(funnelChart.value)
  charts.push(chart)

  const funnelData = {
    register: [
      { value: 1000, name: '浏览首页' },
      { value: 800, name: '点击注册' },
      { value: 600, name: '填写信息' },
      { value: 450, name: '完成注册' },
      { value: 380, name: '首次登录' }
    ],
    purchase: [
      { value: 1000, name: '浏览商品' },
      { value: 840, name: '加入购物车' },
      { value: 620, name: '进入结算' },
      { value: 460, name: '提交订单' },
      { value: 380, name: '完成支付' }
    ]
  }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}人'
    },
    calculable: true,
    series: [
      {
        name: '漏斗分析',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 1000,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: funnelData[funnelType.value]
      }
    ]
  }

  chart.setOption(option)
}

// 初始化留存率图表
const initRetentionChart = () => {
  const chart = echarts.init(retentionChart.value)
  charts.push(chart)

  const option = {
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
      data: ['次日', '3日', '7日', '14日', '30日'],
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: '留存率',
        type: 'line',
        data: [90, 75, 60, 45, 30],
        smooth: true,
        symbolSize: 8,
        lineStyle: {
          width: 4
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(58,77,233,0.3)'
            },
            {
              offset: 1,
              color: 'rgba(58,77,233,0.1)'
            }
          ])
        },
        itemStyle: {
          color: '#3a4de9'
        }
      }
    ]
  }

  chart.setOption(option)
}

// 窗口大小改变时重绘图表
const handleResize = () => {
  charts.forEach((chart) => chart.resize())
}

// 监听时间范围和漏斗类型变化
watch(timeRange, () => {
  // 在实际应用中，这里应该调用API获取新数据
  initHistoryChart()
})

watch(funnelType, () => {
  initFunnelChart()
})

onMounted(() => {
  initHistoryChart()
  initFunnelChart()
  initRetentionChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  charts.forEach((chart) => chart.dispose())
})
</script>

<style scoped lang="less">
.trend-analysis-container {
  .chart-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chart {
      height: 400px;
    }
  }

  :deep(.el-card__header) {
    padding: 15px 20px;
  }
}
</style>