<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { Money, User, Document, PieChart } from '@element-plus/icons-vue'
import Counter from '../components/Counter.vue'
const timeRange = ref('month')
import loadingSvg from '../assets/loading.svg'
const lineChartRef = ref(null)
const pieChartRef = ref(null)
const loading = ref(true)
// 待办事项数据
const todoList = ref([
  {
    content: '新客户询价单待处理',
    time: '2025-06-18 09:00',
    type: 'warning',
    color: '#E6A23C'
  },
  {
    content: '供应商资质审核',
    time: '2025-06-18 10:30',
    type: 'success',
    color: '#67C23A'
  },
  {
    content: '项目进度评审会议',
    time: '2025-06-18 14:00',
    type: 'primary',
    color: '#409EFF'
  },
  {
    content: '合同文件待签署',
    time: '2025-06-18 16:30',
    type: 'danger',
    color: '#F56C6C'
  }
])

// 询价结果数据
const priceList = ref([
  {
    date: '2025-06-18',
    name: '办公设备采购项目',
    supplier: '科技有限公司',
    price: '￥128,000',
    status: '已成交'
  },
  {
    date: '2025-06-17',
    name: '软件开发服务',
    supplier: '信息技术有限公司',
    price: '￥256,000',
    status: '已成交'
  },
  {
    date: '2025-06-16',
    name: '数据中心建设项目',
    supplier: '网络科技有限公司',
    price: '￥980,000',
    status: '进行中'
  },
  {
    date: '2025-06-15',
    name: '安防系统升级',
    supplier: '安防科技有限公司',
    price: '￥158,000',
    status: '已成交'
  }
])

// 初始化图表
onMounted(() => {
  initLineChart()
  initPieChart()

  setTimeout(() => {
    loading.value = false
  }, 1000)
  // const target = document.querySelector('.index-container')
  // const image = window.snapdom.toPng(target)
  // document.body.appendChild(image)
})

// 销售趋势图表
const initLineChart = () => {
  const chart = echarts.init(lineChartRef.value)
  chart.setOption({
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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      }
    ]
  })
}

// 商品分析饼图
const initPieChart = () => {
  const chart = echarts.init(pieChartRef.value)
  chart.setOption({
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
        name: '商品分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
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
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '电子产品' },
          { value: 735, name: '办公用品' },
          { value: 580, name: '家具用品' },
          { value: 484, name: '日常用品' }
        ]
      }
    ]
  })
}
</script>

<template>
  <div
    class="index-container"
    v-loading="loading"
    element-loading-svg='<svg width="50" height="50" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#paint0_angular_3443_12946_clip_path)" data-figma-skip-parse="true"><g transform="matrix(0.013 0 0 0.013 16 16.4624)"><foreignObject x="-1153.85" y="-1153.85" width="2307.69" height="2307.69"><div xmlns="http://www.w3.org/1999/xhtml" style="background:conic-gradient(from 90deg,rgba(255, 255, 255, 0.0001) 0deg,rgba(1, 88, 240, 1) 360deg);height:100%;width:100%;opacity:1"></div></foreignObject></g></g><path fill-rule="evenodd" clip-rule="evenodd" d="M16 25.4624C20.9706 25.4624 25 21.433 25 16.4624C25 11.4918 20.9706 7.4624 16 7.4624C11.0294 7.4624 7 11.4918 7 16.4624C7 21.433 11.0294 25.4624 16 25.4624ZM16 29.4624C23.1797 29.4624 29 23.6421 29 16.4624C29 9.2827 23.1797 3.4624 16 3.4624C8.8203 3.4624 3 9.2827 3 16.4624C3 23.6421 8.8203 29.4624 16 29.4624Z" data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_ANGULAR&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:9.9999997473787516e-05},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.0039215688593685627,&#34;g&#34;:0.34509804844856262,&#34;b&#34;:0.94117647409439087,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;a&#34;:9.9999997473787516e-05},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.0039215688593685627,&#34;g&#34;:0.34509804844856262,&#34;b&#34;:0.94117647409439087,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:26.0,&#34;m01&#34;:0.0,&#34;m02&#34;:3.0,&#34;m10&#34;:0.0,&#34;m11&#34;:26.0,&#34;m12&#34;:3.462402343750},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"/><defs><clipPath id="paint0_angular_3443_12946_clip_path"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 25.4624C20.9706 25.4624 25 21.433 25 16.4624C25 11.4918 20.9706 7.4624 16 7.4624C11.0294 7.4624 7 11.4918 7 16.4624C7 21.433 11.0294 25.4624 16 25.4624ZM16 29.4624C23.1797 29.4624 29 23.6421 29 16.4624C29 9.2827 23.1797 3.4624 16 3.4624C8.8203 3.4624 3 9.2827 3 16.4624C3 23.6421 8.8203 29.4624 16 29.4624Z"/></clipPath></defs></svg>'
  >

    <!-- 顶部四个卡片 -->
    <el-row
      :gutter="20"
      class="mb-4"
    >
      <el-col :span="6">
        <el-card
          shadow="hover"
          class="overview-card blue"
        >
          <div class="data-overview">
            <div class="overview-icon">
              <el-icon
                color="#409EFF"
                :size="40"
              >
                <Money />
              </el-icon>
            </div>
            <div class="overview-content">
              <div class="overview-title">总交易额</div>
              <div class="overview-number">¥ 234,567</div>
              <div class="overview-desc">
                <span class="percentage increase">+12.5%</span>
                <span>较上月</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          shadow="hover"
          class="overview-card green"
        >
          <div class="data-overview">
            <div class="overview-icon">
              <el-icon
                color="#67C23A"
                :size="40"
              >
                <User />
              </el-icon>
            </div>
            <div class="overview-content">
              <div class="overview-title">活跃用户</div>
              <div class="overview-number">1,234</div>
              <div class="overview-desc">
                <span class="percentage increase">+8.2%</span>
                <span>较上周</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          shadow="hover"
          class="overview-card blue"
        >
          <div class="data-overview">
            <div class="overview-icon">
              <el-icon
                color="#E6A23C"
                :size="40"
              >
                <Document />
              </el-icon>
            </div>
            <div class="overview-content">
              <div class="overview-title">订单总量</div>
              <div class="overview-number">892</div>
              <div class="overview-desc">
                <span class="percentage decrease">-2.5%</span>
                <span>较昨日</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          shadow="hover"
          class="overview-card pink"
        >
          <div class="data-overview">
            <div class="overview-icon">
              <el-icon
                color="#F56C6C"
                :size="40"
              >
                <PieChart />
              </el-icon>
            </div>
            <div class="overview-content">
              <div class="overview-title">转化率</div>
              <div class="overview-number">15.8%</div>
              <div class="overview-desc">
                <span class="percentage increase">+5.2%</span>
                <span>较上周</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待办事项卡片 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>待办事项</span>
          <el-button
            link
            text
          >查看全部</el-button>
        </div>
      </template>
      <div
        class="todo-list"
        style="height: 300px;padding-left:10px;"
      >

        <el-timeline>
          <el-timeline-item
            v-for="(todo, index) in todoList"
            :key="index"
            :type="todo.type"
            :color="todo.color"
            :timestamp="todo.time"
            size="large"
          >
            {{ todo.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>

    <!-- 询价结果公示 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>询价结果公示</span>
          <el-button
            text
            link
          >更多</el-button>
        </div>
      </template>
      <el-table
        :data="priceList"
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="日期"
          width="180"
        />
        <el-table-column
          prop="name"
          label="项目名称"
        />
        <el-table-column
          prop="supplier"
          label="供应商"
          width="180"
        />
        <el-table-column
          prop="price"
          label="成交价格"
          width="180"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="100"
        >
          <template #default="scope">
            <el-tag :type="scope.row.status === '已成交' ? 'success' : 'warning'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 底部两个卡片 -->
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>热门商品分析</span>
            </div>
          </template>
          <div
            ref="pieChartRef"
            style="height: 300px"
          ></div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>销售趋势分析</span>
              <div class="chart-actions">
                <el-radio-group
                  v-model="timeRange"
                  size="small"
                >
                  <el-radio-button label="week">周</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div
            ref="lineChartRef"
            style="height: 300px"
          ></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.content .page-container {
  background: var(--bg-color) !important;
  padding: 0px !important;
}
</style>
<style scoped lang="less">
.index-container {
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overview-card {
  cursor: pointer;
  transition: all 0.3s;
  &.blue {
    background: linear-gradient(to right, #f2f9fe, #e6f4fe);
  }
  &.green {
    background: linear-gradient(to right, #f5fef2, #e6feee);
  }
  &.pink {
    background: linear-gradient(to right, #f6f7ff, #ececff);
  }
  border: none;
}

.overview-card:hover {
  transform: translateY(-5px);
}

.data-overview {
  display: flex;
  align-items: center;
  gap: 20px;
}

.overview-icon {
  padding: 15px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
}

.overview-content {
  flex: 1;
}

.overview-title {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.overview-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.overview-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.percentage {
  margin-right: 5px;
  font-weight: bold;
}

.increase {
  color: var(--success);
}

.decrease {
  color: var(--danger);
}

.chart-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.todo-list {
  height: 300px;
  overflow-y: auto;
}
</style>