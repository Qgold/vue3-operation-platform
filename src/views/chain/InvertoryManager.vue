<template>
  <div class="inventory-manager">
    <el-tabs
      v-model="activeTab"
      class="inventory-tabs"
    >

      <!-- 库存预警 -->
      <el-tab-pane
        label="库存预警"
        name="warning"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card
              class="warning-card"
              shadow="hover"
            >
              <template #header>
                <div class="warning-header flex justify-between">
                  <span>库存不足</span>
                  <el-tag type="danger">{{ lowStockCount }}</el-tag>
                </div>
              </template>
              <div class="warning-list">
                <div
                  v-for="item in lowStockItems"
                  :key="item.code"
                  class="warning-item"
                >
                  <span>{{ item.name }}</span>
                  <span class="quantity">
                    当前: {{ item.quantity }} / 最小: {{ item.minStock }}
                  </span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card
              class="warning-card"
              shadow="hover"
            >
              <template #header>
                <div class="warning-header flex justify-between">
                  <span>库存积压</span>
                  <el-tag type="warning">{{ highStockCount }}</el-tag>
                </div>
              </template>
              <div class="warning-list">
                <div
                  v-for="item in highStockItems"
                  :key="item.code"
                  class="warning-item"
                >
                  <span>{{ item.name }}</span>
                  <span class="quantity">
                    当前: {{ item.quantity }} / 最大: {{ item.maxStock }}
                  </span>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card
              class="warning-card"
              shadow="hover"
            >
              <template #header>
                <div class="warning-header flex justify-between">
                  <span>效期预警</span>
                  <el-tag type="error">{{ expiryCount }}</el-tag>
                </div>
              </template>
              <div class="warning-list">
                <div
                  v-for="item in expiryItems"
                  :key="item.code"
                  class="warning-item"
                >
                  <span>{{ item.name }}</span>
                  <span class="quantity">
                    剩余: {{ item.daysToExpiry }}天
                  </span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="warning-chart mt-4">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header flex justify-between">
                <span>预警趋势</span>
                <el-radio-group
                  v-model="warningChartType"
                  size="small"
                >
                  <el-radio-button label="week">周</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <MultiLine
              :xAxisData="warningTrendData.xAxisData"
              :series="warningTrendData.series"
              title="预警趋势"
              :height="400"
              :smooth="true"
              :showArea="true"
              :colors="['#F56C6C', '#E6A23C']"
            />

          </el-card>
        </div>
      </el-tab-pane>
      <!-- 实时库存 -->
      <el-tab-pane
        label="实时库存"
        name="stock"
      >
        <div class="action-bar">
          <div class="left">
            <el-button
              type="primary"
              @click="handleStockIn"
            >入库</el-button>
            <el-button
              type="primary"
              @click="handleStockOut"
            >出库</el-button>
            <el-button @click="handleStockCheck">库存盘点</el-button>
          </div>
          <div class="right">
            <el-input
              v-model="searchQuery"
              placeholder="搜索商品"
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
        </div>

        <el-table
          :data="filteredStock"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="code"
            label="商品编码"
            width="120"
          />
          <el-table-column
            prop="name"
            label="商品名称"
            width="180"
          />
          <el-table-column
            prop="category"
            label="类别"
            width="120"
          />
          <el-table-column
            prop="specification"
            label="规格"
            width="120"
          />
          <el-table-column
            prop="unit"
            label="单位"
            width="80"
          />
          <el-table-column
            prop="quantity"
            label="当前库存"
            width="100"
          >
            <template #default="{ row }">
              <span :class="{ 'stock-warning': row.quantity <= row.minStock }">
                {{ row.quantity }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="minStock"
            label="最小库存"
            width="100"
          />
          <el-table-column
            prop="maxStock"
            label="最大库存"
            width="100"
          />
          <el-table-column
            prop="location"
            label="库位"
            width="120"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getStockStatusTag(row)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="150"
          >
            <template #default="{ row }">
              <el-button
                text
                link
                style="width:46px;height:24px;"
                @click="handleViewDetail(row)"
              >详情</el-button>
              <el-button
                text
                link
                style="width:46px;height:24px;"
                @click="handleAdjust(row)"
              >调整</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 库存调拨 -->
      <el-tab-pane
        label="库存调拨"
        name="transfer"
      >
        <div class="action-bar">
          <el-button
            type="primary"
            @click="handleCreateTransfer"
          >新建调拨单</el-button>
        </div>

        <el-table
          :data="transferOrders"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="orderNo"
            label="调拨单号"
            width="150"
          />
          <el-table-column
            prop="fromLocation"
            label="调出仓库"
            width="150"
          />
          <el-table-column
            prop="toLocation"
            label="调入仓库"
            width="150"
          />
          <el-table-column
            prop="quantity"
            label="调拨数量"
            width="100"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="180"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getTransferStatusTag(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
          >
            <template #default="{ row }">
              <el-button
                type="primary"
                link
                style="width:46px;height:24px;"
                @click="handleViewTransfer(row)"
              >查看</el-button>
              <el-button
                v-if="row.status === '待审核'"
                type="success"
                link
                style="width:46px;height:24px;"
                @click="handleApproveTransfer(row)"
              >审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 批次管理 -->
      <el-tab-pane
        label="批次管理"
        name="batch"
      >
        <el-table
          :data="batchList"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="batchNo"
            label="批次号"
            width="150"
          />
          <el-table-column
            prop="productName"
            label="商品名称"
            width="180"
          />
          <el-table-column
            prop="manufacturer"
            label="生产厂商"
            width="180"
          />
          <el-table-column
            prop="produceDate"
            label="生产日期"
            width="120"
          />
          <el-table-column
            prop="expiryDate"
            label="到期日期"
            width="120"
          />
          <el-table-column
            prop="quantity"
            label="数量"
            width="100"
          />
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getBatchStatusTag(row)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
          >
            <template #default="{ row }">
              <el-button
                type="primary"
                link
                @click="handleViewBatch(row)"
                style="width:46px;height:24px;"
              >查看</el-button>
              <el-button
                type="danger"
                link
                style="width:46px;height:24px;"
                @click="handleLockBatch(row)"
              >锁定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 库存详情弹窗 -->
    <el-dialog
      v-model="stockDetailDialog.visible"
      title="库存详情"
      width="800px"
    >
      <el-descriptions
        :column="2"
        border
      >
        <el-descriptions-item label="商品编码">{{ currentStock.code }}</el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ currentStock.name }}</el-descriptions-item>
        <el-descriptions-item label="当前库存">{{ currentStock.quantity }}</el-descriptions-item>
        <el-descriptions-item label="库位">{{ currentStock.location }}</el-descriptions-item>
      </el-descriptions>

      <div class="batch-list mt-4">
        <h3>批次信息</h3>
        <el-table
          :data="currentStock.batches"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="batchNo"
            label="批次号"
          />
          <el-table-column
            prop="produceDate"
            label="生产日期"
          />
          <el-table-column
            prop="expiryDate"
            label="到期日期"
          />
          <el-table-column
            prop="quantity"
            label="数量"
          />
          <el-table-column
            prop="status"
            label="状态"
          >
            <template #default="{ row }">
              <el-tag :type="getBatchStatusTag(row)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="stock-history mt-4">
        <h3>出入库记录</h3>
        <el-table
          :data="currentStock.history"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="time"
            label="时间"
          />
          <el-table-column
            prop="type"
            label="类型"
          />
          <el-table-column
            prop="quantity"
            label="数量"
          />
          <el-table-column
            prop="operator"
            label="操作人"
          />
          <el-table-column
            prop="remark"
            label="备注"
          />
        </el-table>
      </div>
    </el-dialog>

    <!-- 调拨单弹窗 -->
    <el-dialog
      v-model="transferDialog.visible"
      :title="transferDialog.type === 'create' ? '新建调拨单' : '调拨单详情'"
      width="700px"
    >
      <el-form
        v-if="transferDialog.type === 'create'"
        ref="transferFormRef"
        :model="transferForm"
        :rules="transferRules"
        label-width="100px"
      >
        <el-form-item
          label="调出仓库"
          prop="fromLocation"
        >
          <el-select
            v-model="transferForm.fromLocation"
            placeholder="请选择调出仓库"
          >
            <el-option
              v-for="item in warehouses"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="调入仓库"
          prop="toLocation"
        >
          <el-select
            v-model="transferForm.toLocation"
            placeholder="请选择调入仓库"
          >
            <el-option
              v-for="item in warehouses"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调拨商品">
          <el-button
            type="primary"
            @click="handleAddTransferItem"
          >添加商品</el-button>
          <el-table
            :data="transferForm.items"
            style="width: 100%; margin-top: 10px"
            border
          >
            <el-table-column
              prop="name"
              label="商品名称"
            />
            <el-table-column
              prop="quantity"
              label="数量"
              width="150"
            >
              <template #default="{ row }">
                <el-input-number
                  v-model="row.quantity"
                  :min="1"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
            >
              <template #default="{ $index }">
                <el-button
                  type="danger"
                  link
                  @click="removeTransferItem($index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="transferForm.remark"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div v-else>
        <el-descriptions
          :column="2"
          border
        >
          <el-descriptions-item label="调拨单号">{{ currentTransfer.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getTransferStatusTag(currentTransfer.status)">
              {{ currentTransfer.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="调出仓库">{{ currentTransfer.fromLocation }}</el-descriptions-item>
          <el-descriptions-item label="调入仓库">{{ currentTransfer.toLocation }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentTransfer.createTime }}</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ currentTransfer.creator }}</el-descriptions-item>
        </el-descriptions>

        <div class="transfer-items mt-4">
          <h3>调拨商品</h3>
          <el-table
            :data="currentTransfer.items"
            border
          >
            <el-table-column
              prop="name"
              label="商品名称"
            />
            <el-table-column
              prop="quantity"
              label="数量"
            />
            <el-table-column
              prop="status"
              label="状态"
            >
              <template #default="{ row }">
                <el-tag :type="getTransferItemStatusTag(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="transferDialog.visible = false">取消</el-button>
          <el-button
            v-if="transferDialog.type === 'create'"
            type="primary"
            @click="handleSaveTransfer"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 入库/出库弹窗 -->
    <el-dialog
      v-model="stockDialog.visible"
      :title="stockDialog.title"
      width="700px"
    >
      <el-form
        ref="stockFormRef"
        :model="stockForm"
        :rules="stockRules"
        label-width="100px"
      >
        <el-form-item
          label="仓库"
          prop="warehouse"
        >
          <el-select
            v-model="stockForm.warehouse"
            placeholder="请选择仓库"
          >
            <el-option
              v-for="item in warehouses"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <el-button
            type="primary"
            @click="handleAddStockItem"
          >添加商品</el-button>
          <el-table
            :data="stockForm.items"
            style="width: 100%; margin-top: 10px"
            border
          >
            <el-table-column label="商品名称">
              <template #default="{ row }">
                <el-select
                  v-model="row.code"
                  placeholder="选择商品"
                  @change="handleProductSelect($event, row)"
                >
                  <el-option
                    v-for="item in stockList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.quantity"
                  :min="1"
                />
              </template>
            </el-table-column>
            <el-table-column label="批次号">
              <template #default="{ row }">
                <el-input
                  v-model="row.batchNo"
                  placeholder="请输入批次号"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ $index }">
                <el-button
                  type="danger"
                  link
                  @click="removeStockItem($index)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="stockForm.remark"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="stockDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSaveStock"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 库存盘点弹窗 -->
    <el-dialog
      v-model="checkDialog.visible"
      title="库存盘点"
      width="900px"
    >
      <div class="check-tools mb-4">
        <el-button
          type="primary"
          @click="handleSubmitCheck"
        >提交盘点</el-button>
        <el-button @click="handleExportCheck">导出盘点单</el-button>
      </div>
      <el-table
        :data="checkList"
        border
      >
        <el-table-column
          prop="code"
          label="商品编码"
        />
        <el-table-column
          prop="name"
          label="商品名称"
        />
        <el-table-column
          label="账面数量"
          width="120"
        >
          <template #default="{ row }">
            <span>{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="盘点数量"
          width="150"
        >
          <template #default="{ row }">
            <el-input-number
              v-model="row.checkQuantity"
              :min="0"
              @change="handleCheckQuantityChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="差异"
          width="100"
        >
          <template #default="{ row }">
            <el-tag :type="row.difference === 0 ? 'success' : 'danger'">
              {{ row.difference }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template #default="{ row }">
            <el-input
              v-model="row.remark"
              placeholder="请输入备注"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import MultiLine from '@/components/MultiLine.vue'

// 标签页状态
const activeTab = ref('warning')
const searchQuery = ref('')

// 库存数据
const stockList = ref([
  {
    code: 'P001',
    name: '商品A',
    category: '类别1',
    specification: '规格1',
    unit: '个',
    quantity: 100,
    minStock: 50,
    maxStock: 200,
    location: 'A-01-01',
    status: '正常'
  }
])

// 调拨单数据
const transferOrders = ref([
  {
    orderNo: 'T202505140001',
    fromLocation: '仓库A',
    toLocation: '仓库B',
    quantity: 50,
    createTime: '2025-05-14 10:00:00',
    status: '待审核'
  }
])

// 仓库列表
const warehouses = ref([
  { code: 'WH001', name: '仓库A' },
  { code: 'WH002', name: '仓库B' }
])

// 批次列表
const batchList = ref([
  {
    batchNo: 'B202505140001',
    productName: '商品A',
    manufacturer: '制造商A',
    produceDate: '2025-04-01',
    expiryDate: '2026-04-01',
    quantity: 100,
    status: '正常'
  }
])

// 预警数据
const lowStockItems = ref([
  { code: 'P001', name: '商品A', quantity: 30, minStock: 50 }
])

const highStockItems = ref([
  { code: 'P002', name: '商品B', quantity: 250, maxStock: 200 }
])

const expiryItems = ref([{ code: 'P003', name: '商品C', daysToExpiry: 15 }])

// 计算属性
const filteredStock = computed(() => {
  if (!searchQuery.value) return stockList.value
  return stockList.value.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const lowStockCount = computed(() => lowStockItems.value.length)
const highStockCount = computed(() => highStockItems.value.length)
const expiryCount = computed(() => expiryItems.value.length)

// 预警趋势图数据
const warningChartType = ref('week')
const warningTrendData = computed(() => {
  // 根据选择的时间范围返回不同的数据
  if (warningChartType.value === 'week') {
    return {
      xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      series: [
        {
          name: '库存不足',
          data: [5, 4, 6, 3, 7, 4, 5]
        },
        {
          name: '库存积压',
          data: [3, 2, 4, 5, 3, 2, 4]
        }
      ]
    }
  } else {
    return {
      xAxisData: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ],
      series: [
        {
          name: '库存不足',
          data: [5, 4, 6, 3, 7, 4, 5, 6, 4, 3, 5, 4]
        },
        {
          name: '库存积压',
          data: [3, 2, 4, 5, 3, 2, 4, 3, 5, 4, 3, 2]
        }
      ]
    }
  }
})

// 弹窗状态和表单
const stockDetailDialog = ref({
  visible: false
})

const transferDialog = ref({
  visible: false,
  type: 'create' // 'create' 或 'view'
})

const currentStock = ref({})
const currentTransfer = ref({})

const transferForm = ref({
  fromLocation: '',
  toLocation: '',
  items: [],
  remark: ''
})

const transferRules = {
  fromLocation: [
    { required: true, message: '请选择调出仓库', trigger: 'change' }
  ],
  toLocation: [{ required: true, message: '请选择调入仓库', trigger: 'change' }]
}

// 入库/出库弹窗状态
const stockDialog = ref({
  visible: false,
  type: 'in', // 'in' 或 'out'
  title: ''
})

// 入库/出库表单
const stockFormRef = ref(null)
const stockForm = ref({
  warehouse: '',
  items: [],
  remark: ''
})

const stockRules = {
  warehouse: [{ required: true, message: '请选择仓库', trigger: 'change' }]
}

// 盘点弹窗状态
const checkDialog = ref({
  visible: false
})

// 盘点列表
const checkList = ref([])

// 工具函数
const getStockStatusTag = (row) => {
  if (row.quantity <= row.minStock) return 'danger'
  if (row.quantity >= row.maxStock) return 'warning'
  return 'success'
}

const getTransferStatusTag = (status) => {
  const tags = {
    待审核: 'warning',
    已通过: 'success',
    已拒绝: 'danger'
  }
  return tags[status] || 'info'
}

const getBatchStatusTag = (row) => {
  const daysToExpiry = Math.floor(
    (new Date(row.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
  )
  if (daysToExpiry <= 30) return 'danger'
  if (daysToExpiry <= 90) return 'warning'
  return 'success'
}

const getTransferItemStatusTag = (status) => {
  const tags = {
    待确认: 'info',
    已确认: 'success',
    有异常: 'danger'
  }
  return tags[status] || 'info'
}

// 处理函数
const handleStockIn = () => {
  stockDialog.value = {
    visible: true,
    type: 'in',
    title: '商品入库'
  }
  stockForm.value = {
    warehouse: '',
    items: [],
    remark: ''
  }
}

const handleStockOut = () => {
  stockDialog.value = {
    visible: true,
    type: 'out',
    title: '商品出库'
  }
  stockForm.value = {
    warehouse: '',
    items: [],
    remark: ''
  }
}

const handleStockCheck = () => {
  checkDialog.value.visible = true
  // 初始化盘点数据
  checkList.value = stockList.value.map((item) => ({
    ...item,
    checkQuantity: item.quantity,
    difference: 0,
    remark: ''
  }))
}

const handleViewDetail = (row) => {
  stockDetailDialog.value.visible = true
  currentStock.value = {
    ...row,
    batches: [
      {
        batchNo: 'B202505140001',
        produceDate: '2025-04-01',
        expiryDate: '2026-04-01',
        quantity: 50,
        status: '正常'
      }
    ],
    history: [
      {
        time: '2025-05-14 10:00:00',
        type: '入库',
        quantity: 100,
        operator: '张三',
        remark: '正常入库'
      }
    ]
  }
}

const handleAdjust = (row) => {
  ElMessage.info('库存调整功能开发中...')
}

const handleCreateTransfer = () => {
  transferDialog.value.type = 'create'
  transferDialog.value.visible = true
  transferForm.value = {
    fromLocation: '',
    toLocation: '',
    items: [],
    remark: ''
  }
}

const handleViewTransfer = (row) => {
  transferDialog.value.type = 'view'
  transferDialog.value.visible = true
  currentTransfer.value = {
    ...row,
    creator: '张三',
    items: [
      {
        name: '商品A',
        quantity: 50,
        status: '待确认'
      }
    ]
  }
}

const handleApproveTransfer = (row) => {
  ElMessageBox.confirm('确认审核通过该调拨单？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('审核通过')
  })
}

const handleAddTransferItem = () => {
  transferForm.value.items.push({
    name: '',
    quantity: 1
  })
}

const removeTransferItem = (index) => {
  transferForm.value.items.splice(index, 1)
}

const handleSaveTransfer = () => {
  ElMessage.success('调拨单创建成功')
  transferDialog.value.visible = false
}

const handleViewBatch = (row) => {
  ElMessage.info('批次详情功能开发中...')
}

const handleLockBatch = (row) => {
  ElMessageBox.confirm('确认锁定该批次？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批次已锁定')
  })
}

const handleAddStockItem = () => {
  stockForm.value.items.push({
    code: '',
    quantity: 1,
    batchNo: '',
    name: ''
  })
}

const removeStockItem = (index) => {
  stockForm.value.items.splice(index, 1)
}

const handleSaveStock = async () => {
  if (!stockFormRef.value) return

  try {
    await stockFormRef.value.validate()

    // 根据类型处理入库或出库
    if (stockDialog.value.type === 'in') {
      // 处理入库
      stockForm.value.items.forEach((item) => {
        const stock = stockList.value.find((s) => s.code === item.code)
        if (stock) {
          stock.quantity += item.quantity
        }
      })
      ElMessage.success('入库成功')
    } else {
      // 处理出库
      let canOut = true
      stockForm.value.items.forEach((item) => {
        const stock = stockList.value.find((s) => s.code === item.code)
        if (stock && stock.quantity < item.quantity) {
          canOut = false
          ElMessage.error(`商品 ${stock.name} 库存不足`)
        }
      })

      if (canOut) {
        stockForm.value.items.forEach((item) => {
          const stock = stockList.value.find((s) => s.code === item.code)
          if (stock) {
            stock.quantity -= item.quantity
          }
        })
        ElMessage.success('出库成功')
      } else {
        return
      }
    }

    stockDialog.value.visible = false
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

const handleProductSelect = (code, row) => {
  const product = stockList.value.find((item) => item.code === code)
  if (product) {
    row.name = product.name
  }
}

const handleSubmitCheck = () => {
  // 更新实际库存
  checkList.value.forEach((item) => {
    const stock = stockList.value.find((s) => s.code === item.code)
    if (stock) {
      stock.quantity = item.checkQuantity
    }
  })

  ElMessage.success('盘点完成')
  checkDialog.value.visible = false
}

const handleExportCheck = () => {
  // 这里可以实现导出功能
  ElMessage.success('盘点单已导出')
}

const handleCheckQuantityChange = (row) => {
  row.difference = row.checkQuantity - row.quantity
}
</script>

<style scoped lang="less">
.inventory-tabs {
  border-bottom: none;
  padding-left: 0;
}

.inventory-manager {
}

.action-bar {
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
}

.stock-warning {
  color: #f56c6c;
}

.warning-card {
  height: 100%;
}

.warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warning-list {
  max-height: 300px;
  overflow-y: auto;
}

.warning-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.warning-item:last-child {
  border-bottom: none;
}

.quantity {
  color: #909399;
}

.mt-4 {
  margin-top: 16px;
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}

.chart-card {
  margin-bottom: 20px;
}

.invertory-chart-container {
  width: 100%;
  height: 400px;
  position: relative;
}

.chart-card {
  height: 500px;
}
</style>