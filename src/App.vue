<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from './store/app'
import dayjs from 'dayjs'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
// 1. 引入中文语言包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 2. 将语言包设置为响应式数据（或静态数据）
const locale = zhCn
const appStore = useAppStore()
const dialogVisible = ref(false)
const analysisData = ref(null)
const loading = ref(false)

const userName = localStorage.getItem('userName')
if (userName) {
  appStore.$patch({ userName: userName })
}

// 检查是否需要显示每日分析
const checkDailyAnalysis = async () => {
  const lastOpenDate = localStorage.getItem('lastOpenDate')
  const today = dayjs().format('YYYY-MM-DD')

  if (lastOpenDate !== today) {
    loading.value = true
    try {
      analysisData.value = await getDailyAnalysis()
      dialogVisible.value = true
      localStorage.setItem('lastOpenDate', today)
    } catch (error) {
      console.error('获取每日分析失败:', error)
    } finally {
      loading.value = false
    }
  }
}

onMounted(() => {
  checkDailyAnalysis()
})

// 模拟获取每日分析数据
const getDailyAnalysis = async () => {
  // TODO: 替换为实际的API调用
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    date: dayjs().format('YYYY年MM月DD日'),
    summary: '今日数据分析概要',
    metrics: [
      { label: '销售额', value: '¥128,900', trend: 'up', percentage: '12.3%' },
      { label: '订单量', value: '1,234', trend: 'up', percentage: '8.7%' },
      { label: '活跃用户', value: '3,456', trend: 'down', percentage: '2.1%' },
      { label: '转化率', value: '32.4%', trend: 'up', percentage: '5.2%' }
    ],
    insights: [
      '销售额较昨日增长12.3%，主要来自新品促销活动',
      '用户活跃度略有下降，建议加强用户营销',
      '高价值商品转化率提升明显，可考虑扩大库存'
    ],
    recommendations: [
      '建议关注用户活跃度下降趋势',
      '可以考虑扩大新品促销规模',
      '注意补充热销商品库存'
    ]
  }
}

onMounted(() => {
  checkDailyAnalysis()
})
</script>

<template>

  <router-view />

  <!-- <el-watermark :content="[$t('author')]"> -->

  <!-- </el-watermark> -->
  <el-dialog
    v-model="dialogVisible"
    title="每日数据智能分析"
    width="60%"
    :close-on-click-modal="false"
  >
    <el-skeleton
      :loading="loading"
      animated
      :rows="10"
    >
      <template #default>
        <div
          v-if="analysisData"
          class="daily-analysis"
        >
          <div class="text-center mb-4">
            <h2 class="text-xl font-bold mb-2">{{ analysisData.date }}</h2>
            <p class="text-gray-600">{{ analysisData.summary }}</p>
          </div>

          <!-- 核心指标 -->
          <el-row
            :gutter="20"
            class="mb-6"
          >
            <el-col
              :span="6"
              v-for="metric in analysisData.metrics"
              :key="metric.label"
            >
              <el-card shadow="hover">
                <div class="text-center">
                  <p class="text-gray-600 mb-2">{{ metric.label }}</p>
                  <p class="text-2xl font-bold mb-2">{{ metric.value }}</p>
                  <p :class="[
                    'inline-flex items-center',
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  ]">
                    <el-icon class="mr-1">
                      <CaretTop v-if="metric.trend === 'up'" />
                      <CaretBottom v-else />
                    </el-icon>
                    {{ metric.percentage }}
                  </p>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 数据洞察 -->
          <div class="mb-6">
            <h3 class="text-lg font-bold mb-3">数据洞察</h3>
            <el-card>
              <ul class="list-disc list-inside">
                <li
                  v-for="(insight, index) in analysisData.insights"
                  :key="index"
                  class="mb-2 text-gray-700"
                >
                  {{ insight }}
                </li>
              </ul>
            </el-card>
          </div>

          <!-- 行动建议 -->
          <div>
            <h3 class="text-lg font-bold mb-3">行动建议</h3>
            <el-card>
              <div
                v-for="(recommendation, index) in analysisData.recommendations"
                :key="index"
                class="recommendation-item mt-2"
              >
                <el-tag
                  size="small"
                  type="warning"
                  class="mr-2"
                >建议 {{ index + 1 }}</el-tag>
                {{ recommendation }}
              </div>
            </el-card>
          </div>
        </div>
      </template>
    </el-skeleton>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >
          我知道了
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
