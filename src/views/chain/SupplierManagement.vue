<template>
  <div class="supplier-management">
    <el-tabs
      v-model="activeTab"
      class="supplier-tabs"
      @tab-change="handleTabChange"
    >
      <el-tab-pane
        label="供应商信息"
        name="info"
      >
        <div class="action-bar">
          <el-button
            type="primary"
            @click="handleAddSupplier"
          >新增供应商</el-button>
          <el-input
            v-model="searchQuery"
            placeholder="搜索供应商"
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
          :data="filteredSuppliers"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="code"
            label="供应商编号"
            width="120"
          />
          <el-table-column
            prop="name"
            label="供应商名称"
            width="180"
          />
          <el-table-column
            prop="type"
            label="类型"
            width="120"
          >
            <template #default="{ row }">
              <el-tag :type="getSupplierTypeTag(row.type)">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="contact"
            label="联系人"
            width="120"
          />
          <el-table-column
            prop="phone"
            label="联系电话"
            width="150"
          />
          <el-table-column
            prop="address"
            label="地址"
            width="280"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
                {{ row.status }}
              </el-tag>
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
                @click="handleEdit(row)"
              >编辑</el-button>
              <!-- <el-button
                type="text"
                link
                class="ml-4"
                @click="handleViewContract(row)"
              >查看合同</el-button>
              <el-button
                type="text"
                link
                class="ml-2"
                @click="handleViewPerformance(row)" -->
              <!-- >查看绩效</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane
        label="合同管理"
        name="contract"
      >
        <div class="action-bar">
          <el-button
            type="primary"
            @click="handleAddContract"
          >新增合同</el-button>
        </div>

        <el-table
          :data="contracts"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="contractNo"
            label="合同编号"
            width="150"
          />
          <el-table-column
            prop="supplierName"
            label="供应商名称"
            width="180"
          />
          <el-table-column
            prop="type"
            label="合同类型"
            width="120"
          />
          <el-table-column
            prop="startDate"
            label="开始日期"
            width="120"
          />
          <el-table-column
            prop="endDate"
            label="结束日期"
            width="120"
          />
          <el-table-column
            prop="amount"
            label="合同金额"
            width="120"
          >
            <template #default="{ row }">
              ¥{{ formatNumber(row.amount) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getContractStatusTag(row.status)">{{ row.status }}</el-tag>
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
                @click="handleViewContractDetail(row)"
              >查看</el-button>
              <el-button
                text
                link
                @click="handleEditContract(row)"
                class="ml-2"
              >编辑</el-button>
              <el-button
                text
                link
                class="ml-2"
                @click="handleDeleteContract(row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane
        label="绩效评估"
        name="performance"
      >
        <div class="performance-charts">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card class="chart-card">
                <template #header>
                  <div class="card-header">
                    <span>供应商评分分布</span>
                    <el-select
                      v-model="performanceYear"
                      style="width: 120px"
                    >
                      <el-option
                        label="2025年"
                        value="2025"
                      />
                      <el-option
                        label="2024年"
                        value="2024"
                      />
                    </el-select>
                  </div>
                </template>
                <div class="supplier-chart-container">
                  <el-progress
                    v-for="item in performanceDistribution"
                    :key="item.level"
                    :percentage="item.percentage"
                    :color="item.color"
                    :format="() => `${item.level}: ${item.count}家`"
                    style="margin-bottom: 20px"
                  />
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="chart-card ">
                <template #header>
                  <div class="card-header">
                    <span>月度绩效趋势</span>
                  </div>
                </template>
                <MultiLine
                  v-if="historyTab.includes('performance')"
                  :xAxisData="performanceTrendData.xAxisData"
                  :series="performanceTrendData.series"
                  title="月度绩效趋势"
                  :height="'300px'"
                  :smooth="true"
                  :showArea="true"
                />
              </el-card>
            </el-col>
          </el-row>
        </div>

        <el-table
          :data="supplierPerformance"
          style="width: 100%; margin-top: 20px"
          border
        >
          <el-table-column
            prop="supplierName"
            label="供应商名称"
            width="180"
          />
          <el-table-column
            prop="qualityScore"
            label="质量评分"
            width="180"
          >
            <template #default="{ row }">
              <el-rate
                v-model="row.qualityScore"
                disabled
                show-score
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="deliveryScore"
            label="交付评分"
            width="180"
          >
            <template #default="{ row }">
              <el-rate
                v-model="row.deliveryScore"
                disabled
                show-score
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="costScore"
            label="成本评分"
            width="180"
          >
            <template #default="{ row }">
              <el-rate
                v-model="row.costScore"
                disabled
                show-score
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="totalScore"
            label="总评分"
            width="100"
          >
            <template #default="{ row }">
              <span :style="{ color: getScoreColor(row.totalScore) }">{{ row.totalScore }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="level"
            label="等级"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getPerformanceLevelTag(row.level)">{{ row.level }}</el-tag>
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
                @click="handleViewPerformanceDetail(row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 供应商表单对话框 -->
    <el-dialog
      v-model="supplierDialog.visible"
      :title="supplierDialog.type === 'add' ? '新增供应商' : '编辑供应商'"
      width="600px"
    >
      <el-form
        ref="supplierFormRef"
        :model="supplierForm"
        :rules="supplierRules"
        label-width="100px"
      >
        <el-form-item
          label="供应商名称"
          prop="name"
        >
          <el-input
            v-model="supplierForm.name"
            placeholder="请输入供应商名称"
          />
        </el-form-item>
        <el-form-item
          label="供应商类型"
          prop="type"
        >
          <el-select
            v-model="supplierForm.type"
            placeholder="请选择供应商类型"
          >
            <el-option
              label="生产商"
              value="生产商"
            />
            <el-option
              label="代理商"
              value="代理商"
            />
            <el-option
              label="服务商"
              value="服务商"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="contact"
        >
          <el-input
            v-model="supplierForm.contact"
            placeholder="请输入联系人"
          />
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="phone"
        >
          <el-input
            v-model="supplierForm.phone"
            placeholder="请输入联系电话"
          />
        </el-form-item>
        <el-form-item
          label="地址"
          prop="address"
        >
          <el-input
            v-model="supplierForm.address"
            type="textarea"
            placeholder="请输入地址"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="supplierDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSaveSupplier"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 绩效详情对话框 -->
    <el-dialog
      v-model="performanceDialog.visible"
      title="绩效详情"
      width="800px"
    >
      <el-descriptions
        :column="2"
        border
      >
        <el-descriptions-item label="供应商名称">{{ performanceDetail.supplierName }}</el-descriptions-item>
        <el-descriptions-item label="评估时间">{{ performanceDetail.evaluateTime }}</el-descriptions-item>
        <el-descriptions-item label="评估人">{{ performanceDetail.evaluator }}</el-descriptions-item>
        <el-descriptions-item label="综合等级">
          <el-tag :type="getPerformanceLevelTag(performanceDetail.level)">{{ performanceDetail.level }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div class="score-detail">
        <h3>评分详情</h3>
        <el-row
          :gutter="20"
          class="mt-4"
        >
          <el-col :span="8">
            <el-card class="score-card">
              <template #header>
                <div class="score-header">
                  <span>质量评分</span>
                  <span
                    class="score"
                    :style="{ color: getScoreColor(performanceDetail.qualityScore) }"
                  >
                    {{ performanceDetail.qualityScore }}
                  </span>
                </div>
              </template>
              <div class="score-items">
                <div
                  v-for="(item, index) in performanceDetail.qualityItems"
                  :key="index"
                  class="score-item"
                >
                  <span>{{ item.name }}</span>
                  <el-rate
                    v-model="item.score"
                    disabled
                    show-score
                  />
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="score-card">
              <template #header>
                <div class="score-header">
                  <span>交付评分</span>
                  <span
                    class="score"
                    :style="{ color: getScoreColor(performanceDetail.deliveryScore) }"
                  >
                    {{ performanceDetail.deliveryScore }}
                  </span>
                </div>
              </template>
              <div class="score-items">
                <div
                  v-for="(item, index) in performanceDetail.deliveryItems"
                  :key="index"
                  class="score-item"
                >
                  <span>{{ item.name }}</span>
                  <el-rate
                    v-model="item.score"
                    disabled
                    show-score
                  />
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="score-card">
              <template #header>
                <div class="score-header">
                  <span>成本评分</span>
                  <span
                    class="score"
                    :style="{ color: getScoreColor(performanceDetail.costScore) }"
                  >
                    {{ performanceDetail.costScore }}
                  </span>
                </div>
              </template>
              <div class="score-items">
                <div
                  v-for="(item, index) in performanceDetail.costItems"
                  :key="index"
                  class="score-item"
                >
                  <span>{{ item.name }}</span>
                  <el-rate
                    v-model="item.score"
                    disabled
                    show-score
                  />
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <div class="performance-chart mt-4">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>历史绩效趋势</span>
              </div>
            </template>
            <!-- <LineChart :chartData="performanceDetail.historyData" /> -->
          </el-card>
        </div>

        <div class="evaluation-summary mt-4">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>评估总结</span>
              </div>
            </template>
            <div class="summary-content">
              <p>{{ performanceDetail.summary }}</p>
              <div class="improvement-suggestions">
                <h4>改进建议：</h4>
                <el-tag
                  v-for="(suggestion, index) in performanceDetail.suggestions"
                  :key="index"
                  class="suggestion-tag"
                  :type="index % 2 ? 'warning' : 'info'"
                >
                  {{ suggestion }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-dialog>

    <!-- 合同详情弹窗 -->
    <el-dialog
      v-model="contractDetailDialog.visible"
      title="合同详情"
      width="800px"
    >
      <el-descriptions
        :column="2"
        border
      >
        <el-descriptions-item label="合同编号">{{ contractDetail.contractNo }}</el-descriptions-item>
        <el-descriptions-item label="合同类型">{{ contractDetail.type }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ contractDetail.supplierName }}</el-descriptions-item>
        <el-descriptions-item label="合同状态">
          <el-tag :type="getContractStatusTag(contractDetail.status)">{{ contractDetail.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="签订日期">{{ contractDetail.signDate }}</el-descriptions-item>
        <el-descriptions-item label="合同金额">¥{{ formatNumber(contractDetail.amount) }}</el-descriptions-item>
        <el-descriptions-item label="生效日期">{{ contractDetail.startDate }}</el-descriptions-item>
        <el-descriptions-item label="截止日期">{{ contractDetail.endDate }}</el-descriptions-item>
        <el-descriptions-item label="付款方式">{{ contractDetail.paymentMethod }}</el-descriptions-item>
        <el-descriptions-item label="付款周期">{{ contractDetail.paymentCycle }}</el-descriptions-item>
      </el-descriptions>

      <div class="contract-content mt-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>合同主要条款</span>
            </div>
          </template>
          <el-collapse v-model="activeTerms">
            <el-collapse-item
              v-for="(term, index) in contractDetail.terms"
              :key="index"
              :title="term.title"
              :name="index"
            >
              <div class="term-content">{{ term.content }}</div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>

      <div class="contract-files mt-4">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>合同附件</span>
            </div>
          </template>
          <el-table
            :data="contractDetail.attachments"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="文件名称"
            />
            <el-table-column
              prop="size"
              label="大小"
              width="120"
            />
            <el-table-column
              prop="uploadTime"
              label="上传时间"
              width="180"
            />
            <el-table-column
              label="操作"
              width="120"
            >
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  @click="downloadFile(row)"
                >下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-dialog>

    <!-- 新增/编辑合同弹窗 -->
    <el-dialog
      v-model="contractFormDialog.visible"
      :title="contractFormDialog.type === 'add' ? '新增合同' : '编辑合同'"
      width="700px"
    >
      <el-form
        ref="contractFormRef"
        :model="contractForm"
        :rules="contractRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="合同编号"
              prop="contractNo"
            >
              <el-input
                v-model="contractForm.contractNo"
                placeholder="请输入合同编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="合同类型"
              prop="type"
            >
              <el-select
                v-model="contractForm.type"
                placeholder="请选择合同类型"
                style="width: 100%"
              >
                <el-option
                  label="采购合同"
                  value="采购合同"
                />
                <el-option
                  label="框架协议"
                  value="框架协议"
                />
                <el-option
                  label="服务合同"
                  value="服务合同"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="供应商"
              prop="supplierName"
            >
              <el-select
                v-model="contractForm.supplierName"
                placeholder="请选择供应商"
                style="width: 100%"
              >
                <el-option
                  v-for="supplier in suppliers"
                  :key="supplier.code"
                  :label="supplier.name"
                  :value="supplier.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="合同金额"
              prop="amount"
            >
              <el-input-number
                v-model="contractForm.amount"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              label="生效日期"
              prop="startDate"
            >
              <el-date-picker
                v-model="contractForm.startDate"
                type="date"
                placeholder="选择生效日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="截止日期"
              prop="endDate"
            >
              <el-date-picker
                v-model="contractForm.endDate"
                type="date"
                placeholder="选择截止日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          label="付款方式"
          prop="paymentMethod"
        >
          <el-radio-group v-model="contractForm.paymentMethod">
            <el-radio label="预付款">预付款</el-radio>
            <el-radio label="分期付款">分期付款</el-radio>
            <el-radio label="验收付款">验收付款</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="付款周期"
          prop="paymentCycle"
        >
          <el-select
            v-model="contractForm.paymentCycle"
            placeholder="请选择付款周期"
          >
            <el-option
              label="月结30天"
              value="月结30天"
            />
            <el-option
              label="月结60天"
              value="月结60天"
            />
            <el-option
              label="季度结算"
              value="季度结算"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="合同附件">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            multiple
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <el-button
              class="ml-3"
              @click="uploadFiles"
            >
              上传到服务器
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="contractFormDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSaveContract"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import MultiLine from '@/components/MultiLine.vue'

// 页签激活状态
const activeTab = ref('info')
const searchQuery = ref('')

// 供应商数据
const suppliers = ref([
  {
    code: 'SP001',
    name: '科技有限公司',
    type: '生产商',
    contact: '张三',
    phone: '13800138000',
    address: '广东省深圳市南山区科技园',
    status: '正常'
  }
  // 更多供应商数据...
])

// 合同数据
const contracts = ref([
  {
    contractNo: 'CT2025001',
    supplierName: '科技有限公司',
    type: '采购合同',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    amount: 1000000,
    status: '执行中'
  }
  // 更多合同数据...
])

// 绩效数据
const performanceYear = ref('2025')
const performanceDistribution = ref([
  { level: 'A级', count: 10, percentage: 30, color: '#67C23A' },
  { level: 'B级', count: 15, percentage: 45, color: '#E6A23C' },
  { level: 'C级', count: 8, percentage: 25, color: '#F56C6C' }
])

const supplierPerformance = ref([
  {
    supplierName: '科技有限公司',
    qualityScore: 4.5,
    deliveryScore: 4.0,
    costScore: 4.2,
    totalScore: 4.2,
    level: 'A'
  }
  // 更多绩效数据...
])

// 绩效趋势数据
const performanceTrendData = reactive({
  xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月'],
  series: [
    {
      name: '平均绩效分',
      data: [4.2, 4.3, 4.1, 4.4, 4.5, 4.3]
    }
  ]
})

// 供应商表单
const supplierDialog = ref({
  visible: false,
  type: 'add' // 'add' 或 'edit'
})

const supplierForm = ref({
  name: '',
  type: '',
  contact: '',
  phone: '',
  address: ''
})

const supplierRules = {
  name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择供应商类型', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
}

// 计算属性：过滤后的供应商列表
const filteredSuppliers = computed(() => {
  if (!searchQuery.value) return suppliers.value
  return suppliers.value.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 工具函数
const formatNumber = (num) => {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getSupplierTypeTag = (type) => {
  const tags = {
    生产商: 'success',
    代理商: 'warning',
    服务商: 'info'
  }
  return tags[type] || ''
}

const getContractStatusTag = (status) => {
  const tags = {
    执行中: 'success',
    已完成: 'info',
    已终止: 'danger'
  }
  return tags[status] || ''
}

const getPerformanceLevelTag = (level) => {
  const tags = {
    A: 'success',
    B: 'warning',
    C: 'danger'
  }
  return tags[level] || ''
}

const getScoreColor = (score) => {
  if (score >= 4.5) return '#67C23A'
  if (score >= 4.0) return '#E6A23C'
  return '#F56C6C'
}

// 处理函数
const handleAddSupplier = () => {
  supplierDialog.value.type = 'add'
  supplierDialog.value.visible = true
  supplierForm.value = {
    name: '',
    type: '',
    contact: '',
    phone: '',
    address: ''
  }
}

const handleEdit = (row) => {
  supplierDialog.value.type = 'edit'
  supplierDialog.value.visible = true
  supplierForm.value = { ...row }
}

const handleSaveSupplier = () => {
  // 这里添加保存逻辑
  ElMessage.success(
    supplierDialog.value.type === 'add' ? '添加供应商成功' : '更新供应商成功'
  )
  supplierDialog.value.visible = false
}

const handleViewContract = (row) => {
  activeTab.value = 'contract'
  // 可以添加过滤显示该供应商的合同
}

const handleViewPerformance = (row) => {
  activeTab.value = 'performance'
  // 可以添加过滤显示该供应商的绩效
}

const handleAddContract = () => {
  contractFormDialog.value.type = 'add'
  contractFormDialog.value.visible = true
  contractForm.value = {
    contractNo: '',
    type: '',
    supplierName: '',
    amount: 0,
    startDate: '',
    endDate: '',
    paymentMethod: '',
    paymentCycle: '',
    status: '执行中'
  }
}

const handleViewContractDetail = (row) => {
  contractDetailDialog.value.visible = true
  contractDetail.value = {
    ...row,
    signDate: '2025-05-14',
    paymentMethod: '分期付款',
    paymentCycle: '月结30天',
    terms: [
      {
        title: '合同标的',
        content: '详细的合同内容...'
      },
      {
        title: '质量要求',
        content: '产品质量要求...'
      },
      {
        title: '交付条款',
        content: '交付时间和方式...'
      }
    ],
    attachments: [
      {
        name: '合同扫描件.pdf',
        size: '2.5MB',
        uploadTime: '2025-05-14 10:30:00'
      },
      {
        name: '补充协议.docx',
        size: '1.2MB',
        uploadTime: '2025-05-14 10:31:00'
      }
    ]
  }
}

const handleEditContract = (row) => {
  contractFormDialog.value.type = 'edit'
  contractFormDialog.value.visible = true
  contractForm.value = { ...row }
}
// 监听 tab 切换
const handleTabChange = async (tab) => {
  // // 等待 DOM 更新
  await nextTick()

  if (historyTab.value.includes(tab)) {
    return
  }
  historyTab.value.push(tab)
}
const handleDeleteContract = (row) => {
  ElMessageBox.confirm('确定要删除该合同吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

const handleSaveContract = () => {
  ElMessage.success(
    contractFormDialog.value.type === 'add' ? '添加合同成功' : '更新合同成功'
  )
  contractFormDialog.value.visible = false
}

const handleViewPerformanceDetail = (row) => {
  performanceDialog.value.visible = true
  // 模拟获取详细数据
  performanceDetail.value = {
    supplierName: row.supplierName,
    evaluateTime: '2025-05-14',
    evaluator: '李四',
    level: row.level,
    qualityScore: row.qualityScore,
    deliveryScore: row.deliveryScore,
    costScore: row.costScore,
    qualityItems: [
      { name: '产品质量', score: 4.5 },
      { name: '质量管理', score: 4.3 },
      { name: '质量认证', score: 4.7 }
    ],
    deliveryItems: [
      { name: '准时交付', score: 4.2 },
      { name: '物流效率', score: 3.8 },
      { name: '应急响应', score: 4.0 }
    ],
    costItems: [
      { name: '价格合理性', score: 4.3 },
      { name: '成本控制', score: 4.1 },
      { name: '价格竞争力', score: 4.2 }
    ],
    historyData: {
      labels: ['1月', '2月', '3月', '4月', '5月'],
      datasets: [
        {
          label: '综合评分',
          data: [4.1, 4.2, 4.3, 4.2, 4.4],
          borderColor: '#409EFF',
          tension: 0.4
        }
      ]
    },
    summary:
      '该供应商整体表现良好，质量控制到位，交付及时，具有较强的价格竞争力。但在物流效率和应急响应方面仍有提升空间。',
    suggestions: [
      '加强物流管理系统建设',
      '完善应急响应机制',
      '持续优化质量管理流程',
      '加强成本控制措施'
    ]
  }
}

const handleFileChange = (file) => {
  console.log('选择文件:', file)
}

const uploadFiles = () => {
  ElMessage.success('文件上传成功')
}

const downloadFile = (file) => {
  ElMessage.success(`开始下载文件：${file.name}`)
}

// 添加绩效详情对话框的状态
const performanceDialog = ref({
  visible: false
})

// 绩效详情数据
const performanceDetail = ref({
  supplierName: '',
  evaluateTime: '',
  evaluator: '',
  level: '',
  qualityScore: 0,
  deliveryScore: 0,
  costScore: 0,
  qualityItems: [],
  deliveryItems: [],
  costItems: [],
  historyData: {
    labels: [],
    datasets: []
  },
  summary: '',
  suggestions: []
})

// 合同详情弹窗
const contractDetailDialog = ref({
  visible: false
})

const activeTerms = ref(['0'])

const contractDetail = ref({
  contractNo: '',
  type: '',
  supplierName: '',
  status: '',
  signDate: '',
  amount: 0,
  startDate: '',
  endDate: '',
  paymentMethod: '',
  paymentCycle: '',
  terms: [
    {
      title: '合同标的',
      content: '详细的合同内容...'
    },
    {
      title: '质量要求',
      content: '产品质量要求...'
    },
    {
      title: '交付条款',
      content: '交付时间和方式...'
    }
  ],
  attachments: []
})

const historyTab = ref([])

// 合同表单弹窗
const contractFormDialog = ref({
  visible: false,
  type: 'add' // 'add' 或 'edit'
})

const contractForm = ref({
  contractNo: '',
  type: '',
  supplierName: '',
  amount: 0,
  startDate: '',
  endDate: '',
  paymentMethod: '',
  paymentCycle: '',
  status: '执行中'
})

const contractRules = {
  contractNo: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
  type: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
  supplierName: [
    { required: true, message: '请选择供应商', trigger: 'change' }
  ],
  amount: [{ required: true, message: '请输入合同金额', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
  paymentMethod: [
    { required: true, message: '请选择付款方式', trigger: 'change' }
  ],
  paymentCycle: [
    { required: true, message: '请选择付款周期', trigger: 'change' }
  ]
}
</script>

<style scoped>
.supplier-management {
}

.supplier-tabs {
  background-color: #fff;

  border-radius: 4px;
}

.action-bar {
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
}

/* .chart-card {
  margin-bottom: 20px;
} */

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.supplier-chart-container {
  height: 300px;
  padding: 20px 0;
}

.performance-charts {
  margin-bottom: 30px;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}

:deep(.el-tabs__nav) {
  padding-left: 0 !important;
}

.score-detail {
  margin-top: 20px;
}

.score-card {
  height: 100%;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score {
  font-size: 24px;
  font-weight: bold;
}

.score-items {
  padding: 10px 0;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.performance-chart {
  margin-top: 20px;
}

.evaluation-summary {
  margin-top: 20px;
}

.summary-content {
  padding: 10px;
}

.improvement-suggestions {
  margin-top: 15px;
}

.suggestion-tag {
  margin: 5px;
}

.mt-4 {
  margin-top: 16px;
}

.contract-content {
  margin-top: 20px;
}

.term-content {
  padding: 10px;
  line-height: 1.6;
  color: #606266;
}

.contract-files {
  margin-top: 20px;
}

.upload-demo {
  margin-top: 10px;
}
</style>