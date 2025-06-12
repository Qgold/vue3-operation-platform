<template>
  <div class="channel-management"> <el-tabs
      v-model="activeTab"
      type="border-card"
      @tab-change="handleTabChange"
    >
      <!-- 广告投放管理 -->
      <el-tab-pane
        label="广告投放管理"
        name="advertising"
      >
        <el-card class="mb-4">
          <template #header>
            <div class="flex justify-between items-center">
              <span>广告活动概览</span>
              <el-button
                type="primary"
                @click="createAdCampaign"
              >新建广告活动</el-button>
            </div>
          </template>
          <el-table
            :data="adCampaigns"
            stripe
          >
            <el-table-column
              prop="name"
              label="活动名称"
            />
            <el-table-column
              prop="platform"
              label="投放平台"
            />
            <el-table-column
              prop="budget"
              label="预算"
            />
            <el-table-column
              prop="status"
              label="状态"
            >
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                  {{ row.status === 'active' ? '进行中' : '已结束' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="roi"
              label="ROI"
            />
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button
                  link
                  text
                  @click="editCampaign(row)"
                >编辑</el-button>
                <el-button
                  link
                  text
                  @click="deleteCampaign(row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card>
          <template #header>
            <div class='flex justify-between items-center card-header'>
              <span>广告效果分析</span>
            </div>
          </template>
          <div class="h-80 root">
            <MultiLine
              v-if="historyTab.includes('advertising')"
              :xAxisData="adPerformanceData.xAxisData"
              :series="adPerformanceData.series"
              :height="400"
              :smooth="true"
              :showArea="true"
              :colors="['#F56C6C', '#E6A23C']"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 社交媒体管理 -->
      <el-tab-pane
        label="社交媒体管理"
        name="social"
      >
        <el-card class="mb-4">
          <template #header>
            <div class="flex justify-between items-center">
              <span>社交媒体账号</span>
              <el-button
                type="primary"
                @click="connectSocialAccount"
              >添加账号</el-button>
            </div>
          </template>
          <el-table
            :data="socialAccounts"
            stripe
          >
            <el-table-column
              prop="platform"
              label="平台"
            />
            <el-table-column
              prop="account"
              label="账号"
            />
            <el-table-column
              prop="followers"
              label="粉丝数"
            />
            <el-table-column
              prop="engagement"
              label="互动率"
            />
            <el-table-column label="状态">
              <template #default="{ row }">
                <el-tag :type="row.connected ? 'success' : 'danger'">
                  {{ row.connected ? '已连接' : '未连接' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button
                  link
                  type="primary"
                  @click="viewSocialAnalytics(row)"
                >查看分析</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card>
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span>社交媒体数据分析</span>
            </div>
          </template>
          <div class="h-80 root2">
            <MultiLine
              v-if="historyTab.includes('social')"
              :xAxisData="socialAnalyticsData.xAxisData"
              :series="socialAnalyticsData.series"
              :height="400"
              :smooth="true"
              :showArea="true"
            />
          </div>
        </el-card>
      </el-tab-pane>

      <!-- SEO/SEM管理 -->
      <el-tab-pane
        label="SEO/SEM管理"
        name="seo"
      >
        <el-card class="mb-4">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span>社交媒体数据分析</span>
            </div>
          </template>
          <el-table
            :data="keywordRankings"
            stripe
          >
            <el-table-column
              prop="keyword"
              label="关键词"
            />
            <el-table-column
              prop="ranking"
              label="当前排名"
            />
            <el-table-column
              prop="previousRanking"
              label="上周排名"
            />
            <el-table-column
              prop="searchVolume"
              label="搜索量"
            />
            <el-table-column label="排名变化">
              <template #default="{ row }">
                <el-tag :type="getRankingChangeType(row)">
                  {{ getRankingChange(row) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card>
          <template #header>
            <div
              class="flex  items-center card-header"
              style="gap:20px;"
            >
              <span>网站流量分析</span>
              <el-row span="5">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="updateTrafficData"
                />
              </el-row>
            </div>
          </template>
          <div class="h-80">
            <MultiLine
              v-if="historyTab.includes('seo')"
              :xAxisData="trafficData.xAxisData"
              :series="trafficData.series"
              :height="400"
              :smooth="true"
              :showArea="true"
              :colors="['#F56C6C', '#E6A23C']"
            />
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 广告活动表单对话框 -->
    <el-dialog
      v-model="adFormVisible"
      :title="editingAd ? '编辑广告活动' : '新建广告活动'"
      width="500px"
    >
      <el-form
        :model="adForm"
        label-width="100px"
      >
        <el-form-item label="活动名称">
          <el-input
            v-model="adForm.name"
            placeholder="请输入活动名称"
          />
        </el-form-item>
        <el-form-item
          label="投放平台"
          class="w-103"
        >
          <el-select v-model="adForm.platform">
            <el-option
              label="百度"
              value="baidu"
            />
            <el-option
              label="今日头条"
              value="toutiao"
            />
            <el-option
              label="抖音"
              value="douyin"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预算">
          <el-input-number
            v-model="adForm.budget"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="投放时间">
          <el-date-picker
            v-model="adForm.date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button
          @click="adFormVisible = false"
          type="text"
        >取消</el-button>
        <el-button
          type="primary"
          @click="saveAdCampaign"
        >确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import RectChart from '@/components/RectChart.vue'
import MultiLine from '@/components/MultiLine.vue'

// 标签页激活状态
const activeTab = ref('advertising')

// 控制图表显示
const historyTab = ref(['advertising'])
// 监听 tab 切换
const handleTabChange = async (tab) => {
  // // 等待 DOM 更新
  await nextTick()

  if (historyTab.value.includes(tab)) {
    return
  }
  historyTab.value.push(tab)
}

// 广告活动数据
const adCampaigns = ref([
  {
    name: '618促销广告',
    platform: '今日头条',
    budget: 50000,
    status: 'active',
    roi: '3.5'
  },
  {
    name: '品牌推广',
    platform: '抖音',
    budget: 100000,
    status: 'active',
    roi: '2.8'
  },
  {
    name: '新人福利',
    platform: '淘宝',
    budget: 100000,
    status: 'active',
    roi: '3.8'
  }
])

// 社交媒体账号数据
const socialAccounts = ref([
  {
    platform: '微博',
    account: '@品牌官方',
    followers: '100k',
    engagement: '5.2%',
    connected: true
  },
  {
    platform: '抖音',
    account: '@品牌号',
    followers: '500k',
    engagement: '8.5%',
    connected: true
  }
])

// SEO关键词排名数据
const keywordRankings = ref([
  {
    keyword: '品牌女装',
    ranking: 3,
    previousRanking: 5,
    searchVolume: '50k'
  },
  {
    keyword: '夏季连衣裙',
    ranking: 2,
    previousRanking: 4,
    searchVolume: '80k'
  }
])

// 图表数据
const adPerformanceData = reactive({
  xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  series: [
    {
      name: '点击量',
      data: [150, 230, 180, 290, 200, 250, 300]
    },
    {
      name: '转化量',
      data: [50, 80, 60, 70, 90, 100, 120]
    }
  ]
})

const socialAnalyticsData = reactive({
  xAxisData: ['微博', '抖音', '小红书', '微信'],
  series: [
    {
      name: '粉丝增长',
      data: [1200, 1900, 800, 500]
    }
  ]
})

const trafficData = reactive({
  xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月'],
  series: [
    {
      name: '自然流量',
      data: [4000, 4500, 5000, 4800, 5200, 5500]
    },
    {
      name: '付费流量',
      data: [2000, 2200, 2400, 2300, 2600, 2800]
    }
  ]
})

// 日期范围选择
const dateRange = ref([])

// 广告活动表单
const adFormVisible = ref(false)
const editingAd = ref(null)
const adForm = reactive({
  name: '',
  platform: '',
  budget: 0,
  date: ''
})

// 方法定义
const createAdCampaign = () => {
  editingAd.value = null
  adForm.name = ''
  adForm.platform = ''
  adForm.budget = 0
  adForm.date = ''

  adFormVisible.value = true
}

const editCampaign = (campaign) => {
  editingAd.value = campaign
  Object.assign(adForm, campaign)
  adFormVisible.value = true
}

const deleteCampaign = (campaign) => {
  ElMessage.success('删除成功')
  adCampaigns.value = adCampaigns.value.filter((item) => item !== campaign)
}

const saveAdCampaign = () => {
  if (editingAd.value) {
    const index = adCampaigns.value.indexOf(editingAd.value)
    adCampaigns.value[index] = { ...adForm }
  } else {
    adCampaigns.value.push({ ...adForm, status: 'active', roi: '0.0' })
  }
  adFormVisible.value = false
  ElMessage.success(editingAd.value ? '更新成功' : '创建成功')
}

const connectSocialAccount = () => {
  ElMessage.info('打开社交媒体授权页面')
}

const viewSocialAnalytics = (account) => {
  ElMessage.info(`查看 ${account.platform} 平台分析数据`)
}

const getRankingChangeType = (row) => {
  const change = row.previousRanking - row.ranking
  if (change > 0) return 'success'
  if (change < 0) return 'danger'
  return 'info'
}

const getRankingChange = (row) => {
  const change = row.previousRanking - row.ranking
  if (change > 0) return `上升 ${change} 位`
  if (change < 0) return `下降 ${Math.abs(change)} 位`
  return '持平'
}

const updateTrafficData = () => {
  // 这里可以根据选择的日期范围更新流量数据
  ElMessage.success('数据已更新')
}
</script>

<style scoped>
.channel-management {
  width: 100%;
}

.mb-4 {
  margin-bottom: 16px;
}

.h-80 {
  height: 400px;
  width: 100%;
}

.root,
.root2 {
  width: 100%;
  height: 100%;
}
</style>