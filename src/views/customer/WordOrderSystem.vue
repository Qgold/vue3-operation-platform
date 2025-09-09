<template>
  <div class="work-order-container">
    <!-- 顶部操作栏 -->
    <div class="flex justify-between mb-4">
      <div class="search-box flex gap-2">

        <el-input
          v-model="searchQuery"
          placeholder="搜索工单编号/客户名称"
          style="width: 260px !important;"
        >
          <template #suffix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-select
          v-model="filterStatus"
          placeholder="工单状态"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="filterPriority"
          placeholder="优先级"
        >
          <el-option
            v-for="item in priorityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="action-buttons">
        <el-button
          type="plain"
          @click="handleCreateTicket"
        >
          创建工单
        </el-button>
      </div>
    </div>

    <!-- 工单列表 -->
    <el-table
      :data="filteredTickets"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="ticketId"
        label="工单编号"
        width="160"
      />
      <el-table-column
        prop="title"
        label="工单标题"
        min-width="130"
      />
      <el-table-column
        prop="customerName"
        label="客户名称"
        width="120"
      />
      <el-table-column
        label="优先级"
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type="getPriorityType(row.priority)">
            {{ getPriorityLabel(row.priority) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="assignee"
        label="处理人"
        width="120"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
      />
      <el-table-column
        label="操作"
        width="200"
        fixed="right"
      >
        <template #default="{ row }">
          <el-button
            link
            text
            @click="handleViewDetail(row)"
          >
            查看
          </el-button>
          <el-button
            v-if="row.status === 'pending'"
            link
            text
            @click="handleAssign(row)"
          >
            分配
          </el-button>
          <el-button
            v-if="row.status === 'processing'"
            link
            text
            @click="handleProcess(row)"
          >
            处理
          </el-button>
          <el-button
            v-if="row.status === 'processed'"
            link
            text
            @click="handleClose(row)"
          >
            关闭
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑工单弹窗 -->
    <el-dialog
      v-model="ticketDialog.visible"
      :title="ticketDialog.title"
      width="700px"
    >
      <el-form
        ref="ticketFormRef"
        :model="ticketForm"
        :rules="ticketRules"
        label-width="100px"
      >
        <el-form-item
          label="工单标题"
          prop="title"
        >
          <el-input
            v-model="ticketForm.title"
            placeholder="请输入工单标题"
          />
        </el-form-item>
        <el-form-item
          label="客户名称"
          prop="customerName"
        >
          <el-input
            v-model="ticketForm.customerName"
            placeholder="请输入客户名称"
          />
        </el-form-item>
        <el-form-item
          label="问题类型"
          prop="type"
        >
          <el-select
            v-model="ticketForm.type"
            class="w-full"
            placeholder="请选择问题类型"
          >
            <el-option
              label="产品咨询"
              value="product"
            />
            <el-option
              label="技术支持"
              value="technical"
            />
            <el-option
              label="账户问题"
              value="account"
            />
            <el-option
              label="投诉建议"
              value="complaint"
            />
            <el-option
              label="其他"
              value="other"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="优先级"
          prop="priority"
        >
          <el-select
            v-model="ticketForm.priority"
            class="w-full"
          >
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="问题描述"
          prop="description"
        >
          <el-input
            v-model="ticketForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入问题描述"
          />
        </el-form-item>
        <el-form-item label="附件">
          <Upload
            :multiple="true"
            action="https://api.example.com/upload"
          />

        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ticketDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmitTicket"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 工单详情弹窗 -->
    <el-dialog
      v-model="detailDialog.visible"
      title="工单详情"
      width="800px"
    >
      <el-descriptions
        :column="2"
        border
      >
        <el-descriptions-item label="工单编号">
          {{ detailData.ticketId }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ detailData.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="客户名称">
          {{ detailData.customerName }}
        </el-descriptions-item>
        <el-descriptions-item label="处理人">
          {{ detailData.assignee }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detailData.status)">
            {{ getStatusLabel(detailData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityType(detailData.priority)">
            {{ getPriorityLabel(detailData.priority) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          label="问题描述"
          :span="2"
        >
          {{ detailData.description }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 处理记录 -->
      <div class="process-records mt-4">
        <div class="title font-bold mb-4 text-xl text-left">处理记录</div>
        <el-timeline>
          <el-timeline-item
            v-for="record in detailData.processRecords"
            :key="record.id"
            :timestamp="record.time"
            :type="record.type"
          >
            <div class="record-content">
              <div class="operator">处理人：{{ record.operator }}</div>
              <div class="action">{{ record.action }}</div>
              <div class="comment">备注：{{ record.comment }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

    <!-- 分配工单弹窗 -->
    <el-dialog
      v-model="assignDialog.visible"
      title="分配工单"
      width="500px"
    >
      <el-form
        ref="assignFormRef"
        :model="assignForm"
        :rules="assignRules"
        label-width="100px"
      >
        <el-form-item
          label="处理人"
          prop="assignee"
        >
          <el-select
            v-model="assignForm.assignee"
            class="w-full"
          >
            <el-option
              v-for="user in customerServiceList"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="assignForm.comment"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmitAssign"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 处理工单弹窗 -->
    <el-dialog
      v-model="processDialog.visible"
      title="处理工单"
      width="600px"
    >
      <el-form
        ref="processFormRef"
        :model="processForm"
        :rules="processRules"
        label-width="100px"
      >
        <el-form-item
          label="处理结果"
          prop="result"
        >
          <el-input
            v-model="processForm.result"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item
          label="处理方式"
          prop="method"
        >
          <el-select
            v-model="processForm.method"
            class="w-full"
          >
            <el-option
              label="远程解决"
              value="remote"
            />
            <el-option
              label="现场处理"
              value="onsite"
            />
            <el-option
              label="其他方式"
              value="other"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            class="upload-demo"
            action="https://api.example.com/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            multiple
          >
            <el-button type="primary">上传处理凭证</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="processDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmitProcess"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Upload from '@/components/Upload.vue'
// 状态选项
const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'processing' },
  { label: '已处理', value: 'processed' },
  { label: '已关闭', value: 'closed' }
]

// 优先级选项
const priorityOptions = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' },
  { label: '紧急', value: 'urgent' }
]

// 客服列表
const customerServiceList = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
]

// 搜索和筛选
const searchQuery = ref('')
const filterStatus = ref('')
const filterPriority = ref('')

// 工单数据
const tickets = ref([
  {
    ticketId: 'TK2024051601',
    title: '产品功能咨询',
    customerName: '张三',
    priority: 'high',
    status: 'pending',
    assignee: '-',
    createTime: '2024-05-16 10:00:00',
    description: '需要了解产品的具体功能和使用方法',
    processRecords: [
      {
        id: 1,
        time: '2024-05-16 10:00:00',
        operator: '系统',
        action: '创建工单',
        comment: '自动创建',
        type: 'primary'
      },
      {
        id: 1,
        time: '2024-05-16 10:00:00',
        operator: '系统',
        action: '创建工单',
        comment: '自动创建',
        type: 'primary'
      }
    ]
  }
])

// 弹窗状态
const ticketDialog = reactive({
  visible: false,
  title: '创建工单'
})

const detailDialog = reactive({
  visible: false
})

const assignDialog = reactive({
  visible: false,
  ticketId: null
})

const processDialog = reactive({
  visible: false,
  ticketId: null
})

// 表单数据
const ticketForm = reactive({
  title: '',
  customerName: '',
  type: '',
  priority: 'medium',
  description: ''
})

const assignForm = reactive({
  assignee: '',
  comment: ''
})

const processForm = reactive({
  result: '',
  method: ''
})

// 详情数据
const detailData = ref({})

// 表单校验规则
const ticketRules = {
  title: [{ required: true, message: '请输入工单标题', trigger: 'blur' }],
  customerName: [
    { required: true, message: '请输入客户名称', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  description: [{ required: true, message: '请输入问题描述', trigger: 'blur' }]
}

const assignRules = {
  assignee: [{ required: true, message: '请选择处理人', trigger: 'change' }]
}

const processRules = {
  result: [{ required: true, message: '请输入处理结果', trigger: 'blur' }],
  method: [{ required: true, message: '请选择处理方式', trigger: 'change' }]
}

// 计算属性：过滤后的工单列表
const filteredTickets = computed(() => {
  return tickets.value.filter((ticket) => {
    const matchQuery =
      !searchQuery.value ||
      ticket.ticketId.includes(searchQuery.value) ||
      ticket.customerName.includes(searchQuery.value)

    const matchStatus =
      !filterStatus.value || ticket.status === filterStatus.value
    const matchPriority =
      !filterPriority.value || ticket.priority === filterPriority.value

    return matchQuery && matchStatus && matchPriority
  })
})

// 工具方法
const getStatusType = (status) => {
  const types = {
    pending: 'info',
    processing: 'warning',
    processed: 'success',
    closed: ''
  }
  return types[status] || ''
}

const getStatusLabel = (status) => {
  return statusOptions.find((item) => item.value === status)?.label || status
}

const getPriorityType = (priority) => {
  const types = {
    low: 'info',
    medium: '',
    high: 'warning',
    urgent: 'danger'
  }
  return types[priority] || ''
}

const getPriorityLabel = (priority) => {
  return (
    priorityOptions.find((item) => item.value === priority)?.label || priority
  )
}

// 处理方法
const handleCreateTicket = () => {
  ticketDialog.title = '创建工单'
  Object.assign(ticketForm, {
    title: '',
    customerName: '',
    type: '',
    priority: 'medium',
    description: ''
  })
  ticketDialog.visible = true
}

const handleViewDetail = (row) => {
  detailData.value = row
  detailDialog.visible = true
}

const handleAssign = (row) => {
  assignDialog.ticketId = row.ticketId
  Object.assign(assignForm, {
    assignee: '',
    comment: ''
  })
  assignDialog.visible = true
}

const handleProcess = (row) => {
  processDialog.ticketId = row.ticketId
  Object.assign(processForm, {
    result: '',
    method: ''
  })
  processDialog.visible = true
}

const handleClose = (row) => {
  ElMessageBox.confirm('确定要关闭该工单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tickets.value.findIndex((t) => t.ticketId === row.ticketId)
    if (index !== -1) {
      tickets.value[index].status = 'closed'
      tickets.value[index].processRecords.push({
        id: Date.now(),
        time: new Date().toLocaleString(),
        operator: '当前用户',
        action: '关闭工单',
        comment: '工单处理完成',
        type: 'success'
      })
      ElMessage.success('工单已关闭')
    }
  })
}

const handleSubmitTicket = () => {
  const newTicket = {
    ticketId: `TK${Date.now()}`,
    ...ticketForm,
    status: 'pending',
    assignee: '-',
    createTime: new Date().toLocaleString(),
    processRecords: [
      {
        id: Date.now(),
        time: new Date().toLocaleString(),
        operator: '系统',
        action: '创建工单',
        comment: '自动创建',
        type: 'primary'
      }
    ]
  }
  tickets.value.unshift(newTicket)
  ticketDialog.visible = false
  ElMessage.success('工单创建成功')
}

const handleSubmitAssign = () => {
  const index = tickets.value.findIndex(
    (t) => t.ticketId === assignDialog.ticketId
  )
  if (index !== -1) {
    const assignee = customerServiceList.find(
      (u) => u.id === assignForm.assignee
    )?.name
    tickets.value[index].assignee = assignee
    tickets.value[index].status = 'processing'
    tickets.value[index].processRecords.push({
      id: Date.now(),
      time: new Date().toLocaleString(),
      operator: '当前用户',
      action: `分配给${assignee}`,
      comment: assignForm.comment,
      type: 'warning'
    })
    assignDialog.visible = false
    ElMessage.success('工单分配成功')
  }
}

const handleSubmitProcess = () => {
  const index = tickets.value.findIndex(
    (t) => t.ticketId === processDialog.ticketId
  )
  if (index !== -1) {
    tickets.value[index].status = 'processed'
    tickets.value[index].processRecords.push({
      id: Date.now(),
      time: new Date().toLocaleString(),
      operator: '当前用户',
      action: '处理工单',
      comment: processForm.result,
      type: 'success'
    })
    processDialog.visible = false
    ElMessage.success('工单处理成功')
  }
}

// 文件上传相关方法
const handlePreview = (file) => {
  console.log('preview', file)
}

const handleRemove = (file, fileList) => {
  console.log('remove', file, fileList)
}

const beforeRemove = (file) => {
  return ElMessageBox.confirm(`确定移除 ${file.name}？`)
}
</script>

<style scoped lang="less">
.work-order-container {
  .process-records {
    .record-content {
      .operator {
        font-weight: bold;
        margin-bottom: 4px;
      }
      .action {
        color: #666;
        margin-bottom: 4px;
      }
      .comment {
        color: #999;
        font-size: 14px;
      }
    }
  }
}

.el-tag + .el-tag {
  margin-left: 8px;
}
:deep(.el-input) {
  // width: 220px !important;
}
</style>