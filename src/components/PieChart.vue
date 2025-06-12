<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // 图表数据,格式为 [{name: '分类1', value: 100}, {name: '分类2', value: 200}]
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // 图表高度
  height: {
    type: String,
    default: '300px'
  },
  // 图表标题
  title: {
    type: String,
    default: ''
  },
  // 饼图的半径,支持百分比或具体的像素值
  radius: {
    type: [String, Array],
    default: '60%'
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
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

// 更新图表数据和配置
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
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      show: props.showLegend,
      orient: 'horizontal',
      bottom: 'bottom',
      type: 'scroll'
    },
    series: [
      {
        name: props.title,
        type: 'pie',
        radius: props.radius,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: props.data
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
  () => props.data,
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
/* 确保容器有合适的尺寸 */
div {
  min-height: 200px;
}
</style>