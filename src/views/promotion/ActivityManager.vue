<template>
  <div class="activity-manager">
    <el-tabs
      v-model="activeTab"
      class="activity-tabs"
    >
      <!-- 活动概览 -->
      <el-tab-pane
        label="活动概览"
        name="overview"
      >
        <el-row :gutter="20">
          <el-col
            :span="8"
            v-for="(stat, index) in activityStats"
            :key="index"
          >
            <el-card
              class="stat-card"
              shadow="hover"
            >
              <template #header>
                <div class="stat-header">
                  <span>{{ stat.title }}</span>
                  <el-tag :type="stat.type">{{ stat.status }}</el-tag>
                </div>
              </template>
              <div class="stat-content">
                <div class="stat-number">{{ stat.count }}</div>
                <div class="stat-detail">
                  <span>参与人数: {{ stat.participants }}</span>
                  <span>转化率: {{ stat.conversionRate }}%</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <div class="activity-chart mt-4">
          <el-card>
            <template #header>
              <div class="card-header flex justify-between">
                <span>活动效果趋势</span>
                <el-select
                  v-model="chartActivity"
                  style="width: 200px"
                >
                  <el-option
                    v-for="act in activities"
                    :key="act.id"
                    :label="act.name"
                    :value="act.id"
                  />
                </el-select>
              </div>
            </template>
            <MultiLine
              :xAxisData="activityTrendData.xAxisData"
              :series="activityTrendData.series"
              title="活动效果趋势"
              :height="400"
              :smooth="true"
              :showArea="true"
            />
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 优惠券管理 -->
      <el-tab-pane
        label="优惠券管理"
        name="coupon"
      >
        <div class="action-bar">
          <el-button
            type="primary"
            @click="handleCreateCoupon"
          >创建优惠券</el-button>
          <el-input
            v-model="searchQuery"
            placeholder="搜索优惠券"
            style="width: 200px"
            clearable
          >
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>

        <el-table
          :data="filteredCoupons"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="code"
            label="券码"
            width="120"
          />
          <el-table-column
            prop="name"
            label="名称"
            width="150"
          />
          <el-table-column
            prop="type"
            label="类型"
            width="100"
          >
            <template #default="{ row }">
              <el-tag>{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="优惠额度"
            width="100"
          >
            <template #default="{ row }">
              {{ row.type === '满减券' ? `￥${row.value}` : `${row.value}折` }}
            </template>
          </el-table-column>
          <el-table-column
            prop="condition"
            label="使用条件"
            width="120"
          >
            <template #default="{ row }">
              满{{ row.condition }}元可用
            </template>
          </el-table-column>
          <el-table-column
            prop="validPeriod"
            label="有效期"
            width="200"
          />
          <el-table-column
            prop="quantity"
            label="剩余数量"
            width="100"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getCouponStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
          >
            <template #default="{ row }">
              <el-button
                text
                link
                @click="handleViewCouponDetail(row)"
              >查看</el-button>
              <el-button
                text
                link
                @click="handleEditCoupon(row)"
                :disabled="row.status !== '未开始'"
              >编辑</el-button>
              <el-button
                text
                link
                @click="handleStopCoupon(row)"
                :disabled="row.status !== '进行中'"
              >停止</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 满减活动 -->
      <el-tab-pane
        label="满减活动"
        name="discount"
      >
        <div class="action-bar">
          <el-button
            type="primary"
            @click="handleCreateDiscount"
          >创建满减活动</el-button>
        </div>

        <el-table
          :data="discountActivities"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="name"
            label="活动名称"
            width="150"
          />
          <el-table-column
            prop="rules"
            label="满减规则"
            width="200"
          >
            <template #default="{ row }">
              <div
                v-for="(rule, index) in row.rules"
                :key="index"
              >
                满{{ rule.full }}减{{ rule.minus }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="validPeriod"
            label="有效期"
            width="200"
          />
          <el-table-column
            prop="applyTo"
            label="适用范围"
            width="150"
          />
          <el-table-column
            prop="participantsCount"
            label="参与人数"
            width="100"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getActivityStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
          >
            <template #default="{ row }">
              <el-button
                text
                link
                @click="handleViewDiscountDetail(row)"
              >查看</el-button>
              <el-button
                text
                link
                @click="handleEditDiscount(row)"
                :disabled="row.status !== '未开始'"
              >编辑</el-button>
              <el-button
                text
                link
                @click="handleStopDiscount(row)"
                :disabled="row.status !== '进行中'"
              >停止</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 秒杀活动 -->
      <el-tab-pane
        label="秒杀活动"
        name="seckill"
      >
        <div class="action-bar">
          <el-button
            type="primary"
            @click="handleCreateSeckill"
          >创建秒杀活动</el-button>
        </div>

        <el-table
          :data="seckillActivities"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="name"
            label="活动名称"
            width="150"
          />
          <el-table-column
            prop="products"
            label="秒杀商品"
            width="200"
          >
            <template #default="{ row }">
              <el-popover
                placement="right"
                width="400"
                trigger="hover"
              >
                <template #reference>
                  <span>{{ row.products.length }}个商品</span>
                </template>
                <el-table
                  :data="row.products"
                  border
                >
                  <el-table-column
                    prop="name"
                    label="商品名称"
                  />
                  <el-table-column
                    prop="originalPrice"
                    label="原价"
                    width="100"
                  />
                  <el-table-column
                    prop="seckillPrice"
                    label="秒杀价"
                    width="100"
                  />
                </el-table>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            width="180"
          />
          <el-table-column
            prop="endTime"
            label="结束时间"
            width="180"
          />
          <el-table-column
            prop="stockCount"
            label="库存"
            width="100"
          />
          <el-table-column
            prop="limitPerUser"
            label="限购"
            width="100"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getActivityStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
          >
            <template #default="{ row }">
              <el-button
                text
                link
                @click="handleViewSeckillDetail(row)"
              >查看</el-button>
              <el-button
                text
                link
                @click="handleEditSeckill(row)"
                :disabled="row.status !== '未开始'"
              >编辑</el-button>
              <el-button
                text
                link
                @click="handleStopSeckill(row)"
                :disabled="row.status !== '进行中'"
              >停止</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 优惠券表单弹窗 -->
    <el-dialog
      v-model="couponDialog.visible"
      :title="couponDialog.type === 'create' ? '创建优惠券' : '编辑优惠券'"
      width="600px"
    >
      <el-form
        ref="couponFormRef"
        :model="couponForm"
        :rules="couponRules"
        label-width="100px"
      >
        <el-form-item
          label="优惠券名称"
          prop="name"
        >
          <el-input
            v-model="couponForm.name"
            placeholder="请输入优惠券名称"
          />
        </el-form-item>
        <el-form-item
          label="优惠券类型"
          prop="type"
        >
          <el-select
            v-model="couponForm.type"
            placeholder="请选择优惠券类型"
          >
            <el-option
              label="满减券"
              value="满减券"
            />
            <el-option
              label="折扣券"
              value="折扣券"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="优惠额度"
          prop="value"
        >
          <el-input-number
            v-model="couponForm.value"
            :min="couponForm.type === '折扣券' ? 1 : 0"
            :max="couponForm.type === '折扣券' ? 9.9 : 99999"
            :precision="couponForm.type === '折扣券' ? 1 : 0"
          />
          <span class="ml-2">{{ couponForm.type === '折扣券' ? '折' : '元' }}</span>
        </el-form-item>
        <el-form-item
          label="使用门槛"
          prop="condition"
        >
          <el-input-number
            v-model="couponForm.condition"
            :min="0"
          />
          <span class="ml-2">元</span>
        </el-form-item>
        <el-form-item
          label="发放数量"
          prop="quantity"
        >
          <el-input-number
            v-model="couponForm.quantity"
            :min="1"
          />
        </el-form-item>
        <el-form-item
          label="有效期"
          prop="validPeriod"
        >
          <el-date-picker
            v-model="couponForm.validPeriod"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item
          label="使用说明"
          prop="description"
        >
          <el-input
            v-model="couponForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入优惠券使用说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="couponDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSaveCoupon"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 优惠券详情弹窗 -->
    <el-dialog
      v-model="couponDetailDialog.visible"
      title="优惠券详情"
      width="800px"
    >
      <el-descriptions
        :column="2"
        border
      >
        <el-descriptions-item label="优惠券名称">{{ currentCoupon.name }}</el-descriptions-item>
        <el-descriptions-item label="优惠券类型">{{ currentCoupon.type }}</el-descriptions-item>
        <el-descriptions-item label="优惠额度">
          {{ currentCoupon.type === '满减券' ? `￥${currentCoupon.value}` : `${currentCoupon.value}折` }}
        </el-descriptions-item>
        <el-descriptions-item label="使用门槛">满{{ currentCoupon.condition }}元可用</el-descriptions-item>
        <el-descriptions-item label="发放数量">{{ currentCoupon.quantity }}</el-descriptions-item>
        <el-descriptions-item label="已领取数量">{{ currentCoupon.claimedCount }}</el-descriptions-item>
        <el-descriptions-item label="已使用数量">{{ currentCoupon.usedCount }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getCouponStatusType(currentCoupon.status)">{{ currentCoupon.status }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div class="usage-chart mt-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>使用情况统计</span>
            </div>
          </template>
          <MultiLine
            :xAxisData="couponUsageData.xAxisData"
            :series="couponUsageData.series"
            :height="400"
            :smooth="true"
            :showArea="true"
            :colors="['#F56C6C', '#E6A23C']"
          />
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import MultiLine from '@/components/MultiLine.vue'
// 标签页状态
const activeTab = ref('overview')
const searchQuery = ref('')

// 活动统计数据
const activityStats = ref([
  {
    title: '优惠券活动',
    count: 5,
    status: '进行中',
    type: 'success',
    participants: 1200,
    conversionRate: 35
  },
  {
    title: '满减活动',
    count: 3,
    status: '进行中',
    type: 'warning',
    participants: 800,
    conversionRate: 42
  },
  {
    title: '秒杀活动',
    count: 2,
    status: '未开始',
    type: 'info',
    participants: 0,
    conversionRate: 0
  }
])

// 优惠券数据
const coupons = ref([
  {
    code: 'COUP001',
    name: '新用户优惠券',
    type: '满减券',
    value: 50,
    condition: 200,
    validPeriod: '2025-05-14 至 2025-06-14',
    quantity: 1000,
    status: '进行中',
    claimedCount: 500,
    usedCount: 300
  }
])

// 满减活动数据
const discountActivities = ref([
  {
    name: '618促销活动',
    rules: [
      { full: 300, minus: 50 },
      { full: 500, minus: 100 }
    ],
    validPeriod: '2025-06-01 至 2025-06-18',
    applyTo: '全品类',
    participantsCount: 500,
    status: '未开始'
  }
])

const activities = ref([])
// 秒杀活动数据
const seckillActivities = ref([
  {
    name: '618限时秒杀',
    products: [
      { name: '商品A', originalPrice: 199, seckillPrice: 99 },
      { name: '商品B', originalPrice: 299, seckillPrice: 149 }
    ],
    startTime: '2025-06-18 10:00:00',
    endTime: '2025-06-18 22:00:00',
    stockCount: 100,
    limitPerUser: 1,
    status: '未开始'
  }
])

// 活动效果趋势数据
const chartActivity = ref('')
const activityTrendData = ref({
  xAxisData: ['1号', '2号', '3号', '4号', '5号', '6号', '7号'],
  series: [
    {
      name: '参与人数',
      data: [120, 150, 180, 220, 260, 300, 350]
    },
    {
      name: '转化人数',
      data: [40, 55, 70, 85, 95, 110, 130]
    }
  ]
})

// 优惠券使用情况数据
const couponUsageData = ref({
  xAxisData: ['1号', '2号', '3号', '4号', '5号', '6号', '7号'],
  series: [
    {
      name: '领取数量',
      data: [50, 80, 120, 160, 200, 250, 300]
    },
    {
      name: '使用数量',
      data: [20, 40, 70, 90, 120, 150, 180]
    }
  ]
})

// 弹窗状态
const couponDialog = ref({
  visible: false,
  type: 'create'
})

const couponDetailDialog = ref({
  visible: false
})

// 表单数据
const couponForm = ref({
  name: '',
  type: '',
  value: 0,
  condition: 0,
  quantity: 1000,
  validPeriod: [],
  description: ''
})

const couponRules = {
  name: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
  value: [{ required: true, message: '请输入优惠额度', trigger: 'blur' }],
  validPeriod: [{ required: true, message: '请选择有效期', trigger: 'change' }]
}

// 当前查看的优惠券
const currentCoupon = ref({})

// 计算属性
const filteredCoupons = computed(() => {
  if (!searchQuery.value) return coupons.value
  return coupons.value.filter(
    (coupon) =>
      coupon.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 工具函数
const getCouponStatusType = (status) => {
  const types = {
    未开始: 'info',
    进行中: 'success',
    已结束: 'danger',
    已停止: 'warning'
  }
  return types[status] || 'info'
}

const getActivityStatusType = (status) => {
  const types = {
    未开始: 'info',
    进行中: 'success',
    已结束: 'danger',
    已停止: 'warning'
  }
  return types[status] || 'info'
}

// 处理函数
const handleCreateCoupon = () => {
  couponDialog.value.type = 'create'
  couponDialog.value.visible = true
  couponForm.value = {
    name: '',
    type: '',
    value: 0,
    condition: 0,
    quantity: 1000,
    validPeriod: [],
    description: ''
  }
}

const handleEditCoupon = (row) => {
  couponDialog.value.type = 'edit'
  couponDialog.value.visible = true
  couponForm.value = { ...row }
}

const handleSaveCoupon = () => {
  ElMessage.success(
    couponDialog.value.type === 'create' ? '创建优惠券成功' : '更新优惠券成功'
  )
  couponDialog.value.visible = false
}

const handleViewCouponDetail = (row) => {
  couponDetailDialog.value.visible = true
  currentCoupon.value = row
}

const handleStopCoupon = (row) => {
  ElMessageBox.confirm('确认停止该优惠券活动？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('活动已停止')
  })
}

const handleCreateDiscount = () => {
  ElMessage.info('创建满减活动功能开发中...')
}

const handleViewDiscountDetail = (row) => {
  ElMessage.info('查看满减活动详情功能开发中...')
}

const handleEditDiscount = (row) => {
  ElMessage.info('编辑满减活动功能开发中...')
}

const handleStopDiscount = (row) => {
  ElMessageBox.confirm('确认停止该满减活动？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('活动已停止')
  })
}

const handleCreateSeckill = () => {
  ElMessage.info('创建秒杀活动功能开发中...')
}

const handleViewSeckillDetail = (row) => {
  ElMessage.info('查看秒杀活动详情功能开发中...')
}

const handleEditSeckill = (row) => {
  ElMessage.info('编辑秒杀活动功能开发中...')
}

const handleStopSeckill = (row) => {
  ElMessageBox.confirm('确认停止该秒杀活动？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('活动已停止')
  })
}
</script>

<style scoped>
.activity-manager {
}

.activity-tabs {
  background-color: #fff;
  border-radius: 4px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-content {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.stat-detail {
  display: flex;
  justify-content: space-between;
  color: #909399;
}

.action-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-4 {
  margin-top: 16px;
}

.ml-2 {
  margin-left: 8px;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>