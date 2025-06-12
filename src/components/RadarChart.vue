<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // 雷达图指标维度
  // 格式: [{name: '销售', max: 100}, {name: '管理', max: 100}]
  indicators: {
    type: Array,
    required: true,
    default: () => []
  },
  // 数据系列
  // 格式: [{name: '预算', value: [90, 80]}, {name: '实际', value: [70, 60]}]
  series: {
    type: Array,
    required: true,
    default: () => []
  },
  // 图表高度
  height: {
    type: String,
    default: '400px'
  },
  // 图表标题
  title: {
    type: String,
    default: ''
  },
  // 雷达图形状,'circle' | 'polygon'
  shape: {
    type: String,
    default: 'polygon'
  },
  // 雷达图中心点位置 [x, y]
  center: {
    type: Array,
    default: () => ['50%', '50%']
  },
  // 雷达图半径
  radius: {
    type: [String, Number],
    default: '75%'
  }
})

const chartRef = ref(null)
let chart = null

// 初始化图表
const initChart = () => {
  if (chart) {
    chart.dispose()
  }

  const chartDom = chartRef.value
  if (!chartDom) return

  chart = echarts.init(chartDom)
  updateChart()
}

// 更新图表配置
const updateChart = () => {
  if (!chart) return

  const option = {
    title: {
      text: props.title,
      left: 'center',
      top: 'top',
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    radar: {
      shape: props.shape,
      center: props.center,
      radius: props.radius,
      indicator: props.indicators,
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255,255,255,0.3)', 'rgba(200,200,200,0.3)']
        }
      },
      axisLine: {
        show: true
      },
      splitLine: {
        show: true
      }
    },
    series: [
      {
        type: 'radar',
        emphasis: {
          lineStyle: {
            width: 4
          }
        },
        data: props.series.map((item) => ({
          name: item.name,
          value: item.value,
          symbolSize: 5,
          lineStyle: {
            width: 2
          },
          areaStyle: {
            opacity: 0.3
          }
        }))
      }
    ]
  }

  chart.setOption(option)
}

// 监听窗口大小变化
const handleResize = () => {
  chart && chart.resize()
}

// 监听数据变化
watch(
  [() => props.indicators, () => props.series],
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    ref="chartRef"
    :style="{ 
      height: height,
      width: '100%'
    }"
  ></div>
</template>

<style scoped>
div {
  min-height: 200px;
}
</style>