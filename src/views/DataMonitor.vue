<template>
  <div class="data-monitor-container">
    <div class="indicator-cards">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>今日订单量</span>
                <el-tag type="success">同比 +15%</el-tag>
              </div>
            </template>
            <div class="data-value">2,358</div>
            <div
              ref="orderChart"
              class="chart"
            ></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>活跃用户数</span>
                <el-tag type="warning">同比 +8%</el-tag>
              </div>
            </template>
            <div class="data-value">15,687</div>
            <div
              ref="userChart"
              class="chart"
            ></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>库存预警</span>
                <el-tag type="danger">3 个品类不足</el-tag>
              </div>
            </template>
            <div class="data-value">85%</div>
            <div
              ref="inventoryChart"
              class="chart"
            ></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="trend-charts">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>24小时订单趋势</span>
              </div>
            </template>
            <div
              ref="orderTrendChart"
              class="large-chart"
            ></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>用户活跃度分布</span>
              </div>
            </template>
            <div
              ref="userActivityChart"
              class="large-chart"
            ></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 图表实例引用
const orderChart = ref(null)
const userChart = ref(null)
const inventoryChart = ref(null)
const orderTrendChart = ref(null)
const userActivityChart = ref(null)

// 保存图表实例，用于销毁
const charts = []

// 初始化小型图表
const initMiniChart = (el, data, color) => {
  const chart = echarts.init(el)
  charts.push(chart)

  const option = {
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    xAxis: {
      type: 'category',
      show: false,
      data: new Array(24).fill(0).map((_, i) => i)
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        symbolSize: 0,
        lineStyle: {
          color: color,
          width: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: color
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 0)'
            }
          ])
        }
      }
    ]
  }

  chart.setOption(option)
}

// 初始化订单趋势图
const initOrderTrendChart = (el) => {
  const chart = echarts.init(el)
  charts.push(chart)

  const option = {
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
      data: new Array(24).fill(0).map((_, i) => `${i}:00`)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        data: new Array(24)
          .fill(0)
          .map(() => Math.floor(Math.random() * 200 + 100)),
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 10,
          shadowOffsetY: 8
        },
        itemStyle: {
          color: '#0158f0'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(64,158,255,0.3)'
            },
            {
              offset: 1,
              color: 'rgba(64,158,255,0.1)'
            }
          ])
        }
      }
    ]
  }

  chart.setOption(option)
}

// 初始化用户活跃度图
const initUserActivityChart = (el) => {
  const chart = echarts.init(el)
  charts.push(chart)

  // 获取CSS变量
  const style = getComputedStyle(document.documentElement)
  const getThemeColor = (varName) => style.getPropertyValue(varName).trim()

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        name: '用户活跃度',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        // 自定义每个部分的颜色
        color: [
          getThemeColor('--chart-color-1'), // 日活跃
          getThemeColor('--chart-color-2'), // 周活跃
          getThemeColor('--chart-color-3'), // 月活跃
          getThemeColor('--chart-color-4') // 季活跃
        ],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '日活跃' },
          { value: 735, name: '周活跃' },
          { value: 580, name: '月活跃' },
          { value: 484, name: '季活跃' }
        ]
      }
    ]
  }

  chart.setOption(option)
}

// 窗口大小改变时重绘图表
const handleResize = () => {
  charts.forEach((chart) => chart.resize())
}

onMounted(() => {
  // 初始化各个图表
  initMiniChart(
    orderChart.value,
    new Array(24).fill(0).map(() => Math.random() * 100),
    '#00b25c'
  )
  initMiniChart(
    userChart.value,
    new Array(24).fill(0).map(() => Math.random() * 100),
    '#e0a100'
  )
  initMiniChart(
    inventoryChart.value,
    new Array(24).fill(0).map(() => Math.random() * 100),
    '#de2626'
  )
  initOrderTrendChart(orderTrendChart.value)
  initUserActivityChart(userActivityChart.value)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)

  // 模拟实时数据更新
  const updateInterval = setInterval(() => {
    charts.forEach((chart) => {
      const option = chart.getOption()
      if (option.series[0].type === 'line') {
        const newData = [...option.series[0].data.slice(1), Math.random() * 100]
        chart.setOption({
          series: [
            {
              data: newData
            }
          ]
        })
      }
    })
  }, 3000)

  // 清理定时器
  onUnmounted(() => {
    clearInterval(updateInterval)
    window.removeEventListener('resize', handleResize)
    charts.forEach((chart) => chart.dispose())
  })
})
</script>

<style scoped lang="less">
.data-monitor-container {
  .indicator-cards {
    margin-bottom: 20px;
  }

  .box-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .data-value {
      font-size: 24px;
      font-weight: bold;
      margin: 10px 0;
    }

    .chart {
      height: 50px;
    }

    .large-chart {
      height: 300px;
    }
  }
}
</style>