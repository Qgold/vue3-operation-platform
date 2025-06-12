<template>
  <div
    ref="chartRef"
    class="multi-line-chart"
  ></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick, onActivated } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  id: {
    type: String,
    default: () => 'chart-' + Math.random().toString(36).substr(2, 9)
  },
  // x轴数据
  xAxisData: {
    type: Array,
    default: () => []
  },
  // 系列数据，每个系列包含 name 和 data
  series: {
    type: Array,
    default: () => []
  },
  // 图表标题
  title: {
    type: String,
    default: ''
  },
  // 图表高度
  height: {
    type: [String, Number],
    default: '400px'
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // 是否显示工具提示
  showTooltip: {
    type: Boolean,
    default: true
  },
  // 是否平滑曲线
  smooth: {
    type: Boolean,
    default: true
  },
  // 是否堆叠
  stack: {
    type: Boolean,
    default: false
  },
  // 是否显示面积
  showArea: {
    type: Boolean,
    default: false
  },
  // 自定义颜色
  colors: {
    type: Array,
    default: () => []
  }
})

const chartRef = ref(null)
let chartInstance = null

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  // 如果已经存在实例，先销毁
  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value, null, {
    height:
      typeof props.height === 'number' ? props.height + 'px' : props.height
  })

  updateChart()
}

// 更新图表配置
const updateChart = () => {
  if (!chartInstance) return

  const option = {
    title: props.title
      ? {
          text: props.title,
          left: 'center'
        }
      : null,
    tooltip: props.showTooltip
      ? {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        }
      : null,
    legend: props.showLegend
      ? {
          data: props.series.map((item) => item.name),
          bottom: '0'
        }
      : null,
    grid: {
      left: '3%',
      right: '4%',
      bottom: props.showLegend ? '10%' : '3%',
      top: props.title ? '60' : '30',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.xAxisData,
      axisLine: {
        lineStyle: {
          color: '#999'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#DDD'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: props.series.map((item, index) => ({
      name: item.name,
      type: 'line',
      data: item.data,
      smooth: props.smooth,
      showSymbol: false,
      stack: props.stack ? 'total' : null,
      itemStyle:
        props.colors.length > index
          ? {
              color: props.colors[index]
            }
          : undefined,
      areaStyle: props.showArea
        ? {
            opacity: 0.1
          }
        : undefined
    }))
  }

  chartInstance.setOption(option)
}

// 监听数据变化
watch(() => props.xAxisData, updateChart, { deep: true })
watch(() => props.series, updateChart, { deep: true })

// 监听窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  console.log('kskdskjdjksdjksdjksjkdsjkd')
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped lang="less">
.multi-line-chart {
  width: 100%;
  height: v-bind('typeof height === "number" ? height + "px" : height');
  min-height: 300px;
}
</style>