<template>
  <div class="business-config">
    <el-container>
      <el-main>
        <el-tabs
          v-model="activeTab"
          type="border-card"
        >
          <!-- 物流配送规则 -->
          <el-tab-pane
            name="shipping"
            label="物流配送规则"
          > <el-form
              :model="shippingRules"
              :rules="shippingRules_rules"
              ref="shippingFormRef"
              label-position="right"
              label-width="140px"
            >
              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>基础运费设置</span>
                  </div>
                </template>
                <el-form-item label="计费方式">
                  <el-radio-group v-model="shippingRules.calculationType">
                    <el-radio label="weight">按重量</el-radio>
                    <el-radio label="price">按金额</el-radio>
                    <el-radio label="quantity">按件数</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="起步价">
                  <el-input-number
                    v-model="shippingRules.basePrice"
                    :min="0"
                    :precision="2"
                  >
                    <template #suffix>元</template>
                  </el-input-number>
                </el-form-item>
                <el-form-item label="免运费订单金额">
                  <el-input-number
                    v-model="shippingRules.freeShippingThreshold"
                    :min="0"
                    :precision="2"
                  >
                    <template #suffix>元</template>
                  </el-input-number>
                </el-form-item>
              </el-card>

              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>区域运费设置</span>
                    <el-button
                      text
                      link
                      @click="addRegionRule"
                      style="height:30px;width:100px;"
                    >添加区域规则</el-button>
                  </div>
                </template>
                <div
                  v-for="(rule, index) in shippingRules.regionRules"
                  :key="index"
                  class="region-rule mb-4"
                >
                  <el-divider v-if="index > 0" />
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-bold">区域 {{ index + 1 }}</span>
                    <el-button
                      type="danger"
                      link
                      style="height:24px;width:48px;"
                      @click="removeRegionRule(index)"
                    >删除</el-button>
                  </div>
                  <el-form-item label="配送区域">
                    <el-cascader
                      v-model="rule.regions"
                      :options="regionOptions"
                      :props="{ multiple: true }"
                      placeholder="请选择配送区域"
                    />
                  </el-form-item>
                  <el-form-item label="首重/首件价格">
                    <el-input-number
                      v-model="rule.firstPrice"
                      :min="0"
                      :precision="2"
                    >
                      <template #suffix>元</template>
                    </el-input-number>
                  </el-form-item>
                  <el-form-item label="续重/续件价格">
                    <el-input-number
                      v-model="rule.additionalPrice"
                      :min="0"
                      :precision="2"
                    >
                      <template #suffix>元/{{ shippingRules.calculationType === 'weight' ? 'kg' : '件' }}</template>
                    </el-input-number>
                  </el-form-item>
                </div>
              </el-card>
            </el-form>
          </el-tab-pane>

          <!-- 促销规则 -->
          <el-tab-pane
            name="promotion"
            label="促销规则"
          >
            <el-form
              :model="promotionRules"
              ref="promotionFormRef"
              label-position="right"
              label-width="140px"
            >
              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>会员优惠</span>
                  </div>
                </template>
                <el-form-item label="启用会员折扣">
                  <el-switch v-model="promotionRules.enableMemberDiscount" />
                </el-form-item>
                <el-form-item
                  label="会员等级折扣"
                  v-if="promotionRules.enableMemberDiscount"
                >
                  <div
                    v-for="(level, index) in promotionRules.memberLevels"
                    :key="index"
                    class="mb-2"
                  >
                    <div class="flex items-center">
                      <span class="w-24">{{ level.name }}</span>
                      <el-input-number
                        v-model="level.discount"
                        :min="0"
                        :max="100"
                        :precision="1"
                      >
                        <template #suffix>折</template>
                      </el-input-number>
                    </div>
                  </div>
                </el-form-item>
              </el-card>

              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>满减规则</span>
                    <el-button
                      text
                      link
                      @click="addDiscountRule"
                    >添加规则</el-button>
                  </div>
                </template>
                <div
                  v-for="(rule, index) in promotionRules.discountRules"
                  :key="index"
                  class="mb-2"
                >
                  <div class="flex items-center gap-2">
                    <span>满</span>
                    <el-input-number
                      v-model="rule.threshold"
                      :min="0"
                      :precision="2"
                    />
                    <span>元减</span>
                    <el-input-number
                      v-model="rule.discount"
                      :min="0"
                      :precision="2"
                    />
                    <span>元</span>
                    <el-button
                      type="danger"
                      link
                      @click="removeDiscountRule(index)"
                    >删除</el-button>
                  </div>
                </div>
              </el-card>

              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>特殊促销</span>
                  </div>
                </template>
                <el-form-item label="首单优惠">
                  <el-switch v-model="promotionRules.firstOrderDiscount.enabled" />
                </el-form-item>
                <el-form-item
                  label="首单优惠金额"
                  v-if="promotionRules.firstOrderDiscount.enabled"
                >
                  <el-input-number
                    v-model="promotionRules.firstOrderDiscount.amount"
                    :min="0"
                    :precision="2"
                  >
                    <template #suffix>元</template>
                  </el-input-number>
                </el-form-item>
                <el-divider />
                <el-form-item label="节假日优惠">
                  <el-switch v-model="promotionRules.holidayDiscount.enabled" />
                </el-form-item>
                <template v-if="promotionRules.holidayDiscount.enabled">
                  <el-form-item label="优惠方式">
                    <el-radio-group v-model="promotionRules.holidayDiscount.type">
                      <el-radio label="percentage">折扣</el-radio>
                      <el-radio label="fixed">固定金额</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="优惠值">
                    <el-input-number
                      v-model="promotionRules.holidayDiscount.value"
                      :min="0"
                      :max="promotionRules.holidayDiscount.type === 'percentage' ? 100 : 999999"
                      :precision="promotionRules.holidayDiscount.type === 'percentage' ? 1 : 2"
                    >
                      <template #suffix>{{ promotionRules.holidayDiscount.type === 'percentage' ? '%' : '元' }}</template>
                    </el-input-number>
                  </el-form-item>
                </template>
              </el-card>
            </el-form>
          </el-tab-pane>

          <!-- 积分规则 -->
          <el-tab-pane
            name="points"
            label="积分规则"
          >
            <el-form
              :model="pointRules"
              ref="pointsFormRef"
              label-position="right"
              label-width="140px"
            >
              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>积分获取</span>
                  </div>
                </template>
                <el-form-item label="消费获取积分">
                  <el-input-number
                    v-model="pointRules.pointsPerYuan"
                    :min="0"
                    :step="0.1"
                    :precision="1"
                  >
                    <template #suffix>积分/元</template>
                  </el-input-number>
                </el-form-item>
                <el-form-item label="签到获取积分">
                  <el-input-number
                    v-model="pointRules.checkInPoints"
                    :min="0"
                    :precision="0"
                  >
                    <template #suffix>积分/次</template>
                  </el-input-number>
                </el-form-item>
                <el-form-item label="连续签到奖励">
                  <el-switch v-model="pointRules.continuousCheckIn.enabled" />
                </el-form-item>
                <template v-if="pointRules.continuousCheckIn.enabled">
                  <div
                    v-for="(bonus, index) in pointRules.continuousCheckIn.bonuses"
                    :key="index"
                    class="ml-8 mb-2"
                  >
                    <div class="flex items-center gap-2">
                      <span>连续{{ bonus.days }}天</span>
                      <el-input-number
                        v-model="bonus.points"
                        :min="0"
                        :precision="0"
                      >
                        <template #suffix>积分</template>
                      </el-input-number>
                    </div>
                  </div>
                </template>
              </el-card>

              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>积分使用</span>
                  </div>
                </template>
                <el-form-item label="积分抵扣比例">
                  <div class="flex items-center gap-2">
                    <span>每</span>
                    <el-input-number
                      v-model="pointRules.redemptionThreshold"
                      :min="1"
                      :precision="0"
                    />
                    <span>积分可抵扣</span>
                    <el-input-number
                      v-model="pointRules.redemptionValue"
                      :min="0"
                      :precision="2"
                    />
                    <span>元</span>
                  </div>
                </el-form-item>
                <el-form-item label="单次最大使用">
                  <el-input-number
                    v-model="pointRules.maxRedemption"
                    :min="0"
                    :precision="0"
                  >
                    <template #suffix>积分</template>
                  </el-input-number>
                </el-form-item>
              </el-card>
            </el-form>
          </el-tab-pane>

          <!-- 商品限购 -->
          <el-tab-pane
            name="purchase"
            label="商品限购"
          >
            <el-form
              :model="purchaseRules"
              ref="purchaseFormRef"
              label-position="right"
              label-width="140px"
            >
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>限购规则</span>
                    <el-button
                      text
                      link
                      @click="addPurchaseLimit"
                    >添加规则</el-button>
                  </div>
                </template>
                <div
                  v-for="(rule, index) in purchaseRules.limits"
                  :key="index"
                  class="mb-4"
                >
                  <el-divider v-if="index > 0" />
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-bold">规则 {{ index + 1 }}</span>
                    <el-button
                      type="danger"
                      link
                      @click="removePurchaseLimit(index)"
                    >删除</el-button>
                  </div>
                  <el-form-item label="限购类型">
                    <el-select v-model="rule.type">
                      <el-option
                        label="单个商品"
                        value="single"
                      />
                      <el-option
                        label="商品分类"
                        value="category"
                      />
                      <el-option
                        label="所有商品"
                        value="all"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="选择商品"
                    v-if="rule.type === 'single'"
                  >
                    <el-select
                      v-model="rule.productIds"
                      multiple
                      filterable
                      placeholder="请选择商品"
                    >
                      <el-option
                        v-for="item in productOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="选择分类"
                    v-if="rule.type === 'category'"
                  >
                    <el-cascader
                      v-model="rule.categories"
                      :options="categoryOptions"
                      :props="{ multiple: true }"
                      placeholder="请选择商品分类"
                    />
                  </el-form-item>
                  <el-form-item label="限购周期">
                    <el-select v-model="rule.period">
                      <el-option
                        label="每天"
                        value="daily"
                      />
                      <el-option
                        label="每周"
                        value="weekly"
                      />
                      <el-option
                        label="每月"
                        value="monthly"
                      />
                      <el-option
                        label="永久"
                        value="forever"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="限购数量">
                    <el-input-number
                      v-model="rule.quantity"
                      :min="1"
                      :precision="0"
                    >
                      <template #suffix>件</template>
                    </el-input-number>
                  </el-form-item>
                </div>
              </el-card>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="flex justify-end mt-4 gap-2">
          <el-button @click="resetSettings">重置</el-button>
          <el-button
            type="primary"
            @click="saveSettings"
            :loading="saving"
          >保存设置</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getBusinessRules,
  updateBusinessRules,
  resetBusinessRules,
  getProducts,
  getCategories,
  getRegions
} from '@/api/business'

// 状态变量
const activeTab = ref('shipping')
const saving = ref(false)
const loading = ref(true)

// 表单引用
const shippingFormRef = ref(null)
const promotionFormRef = ref(null)
const pointsFormRef = ref(null)
const purchaseFormRef = ref(null)

// 验证规则
const shippingRules_rules = {
  basePrice: [
    { required: true, message: '请输入起步价', trigger: 'blur' },
    { type: 'number', min: 0, message: '起步价不能小于0', trigger: 'blur' }
  ],
  freeShippingThreshold: [
    { required: true, message: '请输入免运费订单金额', trigger: 'blur' },
    {
      type: 'number',
      min: 0,
      message: '免运费订单金额不能小于0',
      trigger: 'blur'
    }
  ],
  calculationType: [
    { required: true, message: '请选择计费方式', trigger: 'change' }
  ],
  regionRules: {
    type: 'array',
    fields: {
      regions: { required: true, message: '请选择配送区域', trigger: 'change' },
      firstPrice: {
        required: true,
        type: 'number',
        min: 0,
        message: '请输入首重/首件价格',
        trigger: 'blur'
      },
      additionalPrice: {
        required: true,
        type: 'number',
        min: 0,
        message: '请输入续重/续件价格',
        trigger: 'blur'
      }
    }
  }
}

// 物流配送规则
const shippingRules = reactive({
  calculationType: 'weight',
  basePrice: 10,
  freeShippingThreshold: 99,
  regionRules: [
    {
      regions: [],
      firstPrice: 10,
      additionalPrice: 5
    }
  ]
})

// 促销规则
const promotionRules = reactive({
  enableMemberDiscount: true,
  memberLevels: [
    { name: '普通会员', discount: 100 },
    { name: '银卡会员', discount: 95 },
    { name: '金卡会员', discount: 90 },
    { name: '钻石会员', discount: 85 }
  ],
  discountRules: [
    { threshold: 100, discount: 10 },
    { threshold: 200, discount: 25 }
  ],
  firstOrderDiscount: {
    enabled: true,
    amount: 10
  },
  holidayDiscount: {
    enabled: false,
    type: 'percentage',
    value: 90
  }
})

// 积分规则
const pointRules = reactive({
  pointsPerYuan: 1,
  checkInPoints: 5,
  continuousCheckIn: {
    enabled: true,
    bonuses: [
      { days: 3, points: 10 },
      { days: 7, points: 30 },
      { days: 30, points: 100 }
    ]
  },
  redemptionThreshold: 100,
  redemptionValue: 1,
  maxRedemption: 1000
})

// 商品限购规则
const purchaseRules = reactive({
  limits: [
    {
      type: 'single',
      productIds: [],
      period: 'daily',
      quantity: 2
    }
  ]
})

// 模拟数据
const regionOptions = [
  {
    value: 'north',
    label: '华北',
    children: [
      { value: 'beijing', label: '北京' },
      { value: 'tianjin', label: '天津' }
    ]
  },
  {
    value: 'east',
    label: '华东',
    children: [
      { value: 'shanghai', label: '上海' },
      { value: 'jiangsu', label: '江苏' }
    ]
  }
]

const productOptions = [
  { value: 1, label: '商品A' },
  { value: 2, label: '商品B' }
]

const categoryOptions = [
  {
    value: 'electronics',
    label: '电子产品',
    children: [
      { value: 'phone', label: '手机' },
      { value: 'computer', label: '电脑' }
    ]
  }
]

// 方法
const addRegionRule = () => {
  shippingRules.regionRules.push({
    regions: [],
    firstPrice: 10,
    additionalPrice: 5
  })
}

const removeRegionRule = (index) => {
  shippingRules.regionRules.splice(index, 1)
}

const addDiscountRule = () => {
  promotionRules.discountRules.push({
    threshold: 0,
    discount: 0
  })
}

const removeDiscountRule = (index) => {
  promotionRules.discountRules.splice(index, 1)
}

const addPurchaseLimit = () => {
  purchaseRules.limits.push({
    type: 'single',
    productIds: [],
    period: 'daily',
    quantity: 1
  })
}

const removePurchaseLimit = (index) => {
  purchaseRules.limits.splice(index, 1)
}

// 初始化
onMounted(() => {
  initData()
})

// 初始化数据
const initData = async () => {
  try {
    loading.value = true
    const [rulesRes, productsRes, categoriesRes, regionsRes] =
      await Promise.all([
        getBusinessRules(),
        getProducts(),
        getCategories(),
        getRegions()
      ])

    // 更新配置规则
    Object.assign(shippingRules, rulesRes.data.shipping)
    Object.assign(promotionRules, rulesRes.data.promotion)
    Object.assign(pointRules, rulesRes.data.points)
    Object.assign(purchaseRules, rulesRes.data.purchase)

    // 更新选项数据
    productOptions.value = productsRes.data.map((item) => ({
      value: item.id,
      label: item.name
    }))
    categoryOptions.value = categoriesRes.data
    regionOptions.value = regionsRes.data
  } catch (error) {
    ElMessage.error('初始化数据失败')
  } finally {
    loading.value = false
  }
}

const resetSettings = async () => {
  try {
    await ElMessageBox.confirm('确定要重置所有设置吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    await resetBusinessRules()
    await initData()
    ElMessage.success('设置已重置')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('重置设置失败')
    }
  } finally {
    loading.value = false
  }
}

const validateForms = async () => {
  const forms = [
    shippingFormRef.value,
    promotionFormRef.value,
    pointsFormRef.value,
    purchaseFormRef.value
  ]
  const results = await Promise.all(
    forms.map((form) => form?.validate().catch(() => false))
  )
  return results.every((valid) => valid !== false)
}

const saveSettings = async () => {
  try {
    // 表单验证
    if (!(await validateForms())) {
      ElMessage.warning('请检查表单填写是否正确')
      return
    }

    saving.value = true
    const data = {
      shipping: shippingRules,
      promotion: promotionRules,
      points: pointRules,
      purchase: purchaseRules
    }
    await updateBusinessRules(data)
    ElMessage.success('设置保存成功')
  } catch (error) {
    ElMessage.error('设置保存失败')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.business-config {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-card__header) {
  padding: 10px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
  font-weight: bold;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style>