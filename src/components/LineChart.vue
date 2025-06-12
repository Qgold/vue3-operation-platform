<script setup>
// import G2 from '@antv/g2'
import { ref, onMounted, defineProps } from 'vue'

import * as echarts from 'echarts'

defineProps({
  // props
  chartData: Object
})
onMounted(() => {
  var dom = document.getElementById('mount')
  var myChart = echarts.init(dom, null, {
    renderer: 'canvas',

    height: 400,
    useDirtyRect: false
  })
  var app = {}

  var option

  option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  }

  if (option && typeof option === 'object') {
    myChart.setOption(option)
  }

  window.addEventListener('resize', myChart.resize)
})
</script>

<template>
  <div
    class="log-item"
    id="mount"
  ></div>
</template>

<style scoped lang="less">
.log-item {
  border-radius: 4px;
  margin: 0; /* 移除原有的 margin */
  min-height: 100px;
}
</style>