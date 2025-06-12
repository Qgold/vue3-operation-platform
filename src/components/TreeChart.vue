<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  // 树图数据,格式为:
  // {
  //   name: 'root',
  //   children: [
  //     { name: 'child1', children: [ {name: 'grandchild'} ] },
  //     { name: 'child2' }
  //   ]
  // }
  data: {
    type: Object,
    required: true
  },
  // 图表高度
  height: {
    type: String,
    default: '600px'
  },
  // 图表标题
  title: {
    type: String,
    default: ''
  },
  // 树图布局方向: 'vertical' | 'horizontal'
  orient: {
    type: String,
    default: 'horizontal'
  },
  // 节点间的距离
  nodeGap: {
    type: Number,
    default: 20
  },
  // 是否折叠展开
  expandAndCollapse: {
    type: Boolean,
    default: true
  },
  // 初始展开的层级，-1表示全部展开
  initialTreeDepth: {
    type: Number,
    default: 2
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
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    series: [
      {
        type: 'tree',
        data: [props.data],
        top: '10%',
        bottom: '10%',
        layout: 'orthogonal',
        orient: props.orient,
        initialTreeDepth: props.initialTreeDepth,
        symbol: 'emptyCircle',
        symbolSize: 8,
        nodePadding: props.nodeGap,
        expandAndCollapse: props.expandAndCollapse,
        animationDuration: 550,
        animationDurationUpdate: 750,
        label: {
          position: props.orient === 'horizontal' ? 'left' : 'top',
          rotate: props.orient === 'horizontal' ? 0 : -90,
          verticalAlign: 'middle',
          align: 'right',
          distance: 10,
          fontSize: 14
        },
        leaves: {
          label: {
            position: props.orient === 'horizontal' ? 'right' : 'bottom',
            rotate: props.orient === 'horizontal' ? 0 : -90,
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        emphasis: {
          focus: 'descendant'
        },
        itemStyle: {
          borderWidth: 1
        },
        lineStyle: {
          width: 1,
          curveness: 0.5
        }
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
div {
  min-height: 300px;
}
</style>