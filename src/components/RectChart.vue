<script setup>
// import G2 from '@antv/g2'
import { ref, onMounted } from 'vue'

import * as echarts from 'echarts'

onMounted(() => {
  var chartDom = document.getElementById('mount2')
  var myChart = echarts.init(chartDom, null, {
    renderer: 'canvas',
    height: 400,
    useDirtyRect: false
  })

  // 获取CSS变量
  const style = getComputedStyle(document.documentElement)
  const getThemeColor = (varName) => style.getPropertyValue(varName).trim()

  var option
  option = {
    // 全局调色盘。使用CSS变量
    color: [
      getThemeColor('--chart-color-1'),
      getThemeColor('--chart-color-2'),
      getThemeColor('--chart-color-3'),
      getThemeColor('--chart-color-4'),
      getThemeColor('--chart-color-5'),
      getThemeColor('--chart-color-6'),
      getThemeColor('--chart-color-7'),
      getThemeColor('--chart-color-8'),
      getThemeColor('--chart-color-9')
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        // 为这个系列单独设置颜色
        itemStyle: {
          color: getThemeColor('--chart-color-1')
        },
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Email',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: getThemeColor('--chart-color-2')
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: getThemeColor('--chart-color-3')
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: getThemeColor('--chart-color-4')
        },
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Search Engine',
        type: 'bar',
        data: [862, 1018, 964, 1026, 1679, 1600, 1570],
        emphasis: {
          focus: 'series'
        },
        // 使用渐变色
        itemStyle: {
          // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          //   { offset: 0, color: '#83bff6' },
          //   { offset: 0.5, color: '#188df0' },
          //   { offset: 1, color: '#188df0' }
          // ])
          color: getThemeColor('--chart-color-5')
        },
        markLine: {
          lineStyle: {
            type: 'dashed'
          },
          data: [[{ type: 'min' }, { type: 'max' }]]
        }
      },
      {
        name: 'Baidu',
        type: 'bar',
        barWidth: 5,
        stack: 'Search Engine',
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: getThemeColor('--chart-color-6')
        },
        data: [620, 732, 701, 734, 1090, 1130, 1120]
      },
      {
        name: 'Google',
        type: 'bar',
        stack: 'Search Engine',
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: getThemeColor('--chart-color-7')
        },
        data: [120, 132, 101, 134, 290, 230, 220]
      },
      {
        name: 'Bing',
        type: 'bar',
        stack: 'Search Engine',
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: getThemeColor('--chart-color-8')
        },
        data: [60, 72, 71, 74, 190, 130, 110]
      },
      {
        name: 'Others',
        type: 'bar',
        stack: 'Search Engine',
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: getThemeColor('--chart-color-9')
        },
        data: [62, 82, 91, 84, 109, 110, 120]
      }
    ]
  }

  option && myChart.setOption(option)
})
</script>

<template>
  <div
    class="log-item"
    id="mount2"
  ></div>
</template>

<style scoped lang="less">
:root {
  --chart-color-1: #2f7afa;
  --chart-color-2: #00c1cf;
  --chart-color-3: #9f76f4;
  --chart-color-4: #f5a258;
  --chart-color-5: #54c274;
  --chart-color-6: #e790e0;
  --chart-color-7: #020202;
  --chart-color-8: #96aed6;
  --chart-color-9: #8fb3be;
}

.log-item {
  border-radius: 4px;
  margin: 0;
  min-height: 100px;
}
</style>