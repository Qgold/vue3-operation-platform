<template>
  <div class="user-reach">
    <el-tabs
      v-model="activeTab"
      class="reach-tabs"
    >
      <!-- 消息概览 -->
      <el-tab-pane
        label="消息概览"
        name="overview"
      >
        <el-row :gutter="20">
          <el-col
            :span="8"
            v-for="(stat, index) in messageStats"
            :key="index"
          >
            <el-card
              class="stat-card"
              shadow="hover"
            >
              <template #header>
                <div class="stat-header">
                  <span>{{ stat.title }}</span>
                  <el-tag :type="stat.type">{{ stat.count }}</el-tag>
                </div>
              </template>
              <div class="stat-content">
                <div class="stat-item">
                  <span>发送成功率：</span>
                  <el-progress
                    :percentage="stat.successRate"
                    color="var(--primary-color)"
                  />
                </div>
                <div class="stat-item">
                  <span>打开率：</span>
                  <el-progress
                    :percentage="stat.openRate"
                    color="var(--primary-color)"
                  />
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 趋势图 -->
        <div class="trend-chart mt-4">
          <el-card>
            <template #header>
              <div class="flex justify-between items-center">
                <span>消息触达趋势</span>
                <el-radio-group
                  v-model="chartPeriod"
                  size="small"
                >
                  <el-radio-button label="week">周</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <MultiLine
              :xAxisData="trendData.xAxisData"
              :series="trendData.series"
              height="300"
              :colors="[getThemeColor('--chart-color-1'), getThemeColor('--chart-color-2'), getThemeColor('--chart-color-3')]"
            />
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 消息管理 -->
      <el-tab-pane
        label="消息管理"
        name="message"
      >
        <div class="action-bar">

          <el-select
            v-model="messageType"
            placeholder="消息类型"
            style="width: 120px"
          >
            <el-option
              label="站内消息"
              value="inapp"
            />
            <el-option
              label="邮件"
              value="email"
            />
            <el-option
              label="短信"
              value="sms"
            />
          </el-select>
          <el-select
            v-model="messageStatus"
            placeholder="发送状态"
            style="width: 120px"
          >
            <el-option
              label="待发送"
              value="pending"
            />
            <el-option
              label="发送中"
              value="sending"
            />
            <el-option
              label="已发送"
              value="sent"
            />
            <el-option
              label="发送失败"
              value="failed"
            />
          </el-select>

          <el-button
            type="primary"
            @click="createMessage"
          >新建消息</el-button>
        </div>

        <el-table
          :data="messageList"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="title"
            label="标题"
            min-width="200"
          />
          <el-table-column
            prop="type"
            label="类型"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getMessageTypeTag(row.type)">
                {{ getMessageTypeLabel(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="100"
          >
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="sendTime"
            label="发送时间"
            width="180"
          />
          <el-table-column
            prop="targetCount"
            label="目标用户"
            width="100"
          />
          <el-table-column
            prop="successRate"
            label="发送成功率"
            width="120"
          >
            <template #default="{ row }">
              {{ row.successRate }}%
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                text
                link
                @click="viewMessageDetail(row)"
              >
                查看详情
              </el-button>
              <el-button
                text
                link
                v-if="row.status === '待发送'"
                @click="editMessage(row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 新建/编辑消息弹窗 -->
    <el-dialog
      v-model="messageDialog.visible"
      :title="messageDialog.type === 'create' ? '新建消息' : '编辑消息'"
      width="600px"
    >
      <el-form
        :model="messageForm"
        :rules="messageRules"
        ref="messageFormRef"
      >
        <el-form-item
          label="消息类型"
          prop="type"
        >
          <el-select
            v-model="messageForm.type"
            placeholder="请选择消息类型"
          >
            <el-option
              label="站内消息"
              value="inapp"
            />
            <el-option
              label="邮件"
              value="email"
            />
            <el-option
              label="短信"
              value="sms"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="消息标题"
          prop="title"
        >
          <el-input v-model="messageForm.title" />
        </el-form-item>
        <el-form-item
          label="消息内容"
          prop="content"
        >
          <el-input
            v-model="messageForm.content"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item
          label="发送时间"
          prop="sendTime"
        >
          <el-date-picker
            v-model="messageForm.sendTime"
            type="datetime"
            placeholder="选择发送时间"
          />
        </el-form-item>
        <el-form-item
          label="目标用户"
          prop="targetUsers"
        >
          <el-select
            v-model="messageForm.targetUsers"
            multiple
            filterable
            placeholder="请选择目标用户群体"
          >
            <el-option
              v-for="item in userGroups"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="messageDialog.visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitMessage"
        >确定</el-button>
      </template>
    </el-dialog>

    <!-- 消息详情弹窗 -->
    <el-dialog
      v-model="messageDetailDialog.visible"
      title="消息详情"
      width="800px"
    >
      <el-descriptions
        :column="2"
        border
      >
        <el-descriptions-item label="消息标题">
          {{ messageDetail.title }}
        </el-descriptions-item>
        <el-descriptions-item label="消息类型">
          <el-tag :type="getMessageTypeTag(messageDetail.type)">
            {{ getMessageTypeLabel(messageDetail.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发送状态">
          <el-tag :type="getStatusType(messageDetail.status)">
            {{ messageDetail.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发送时间">
          {{ messageDetail.sendTime }}
        </el-descriptions-item>
        <el-descriptions-item label="目标用户数">
          {{ messageDetail.targetCount }}
        </el-descriptions-item>
        <el-descriptions-item label="发送成功率">
          {{ messageDetail.successRate }}%
        </el-descriptions-item>
        <el-descriptions-item
          label="消息内容"
          :span="2"
        >
          {{ messageDetail.content }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="mt-4">
        <h4>发送统计</h4>
        <el-row
          :gutter="20"
          class="mt-2"
        >
          <el-col :span="8">
            <div class="stat-box">
              <div class="stat-label">发送成功</div>
              <div class="stat-value text-success">{{ messageDetail.stats?.success || 0 }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-box">
              <div class="stat-label">发送失败</div>
              <div class="stat-value text-danger">{{ messageDetail.stats?.failed || 0 }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="stat-box">
              <div class="stat-label">打开数</div>
              <div class="stat-value text-primary">{{ messageDetail.stats?.opened || 0 }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!-- 添加消息详情弹窗 -->
    <el-dialog
      v-model="detailDialog.visible"
      title="消息详情"
      width="600px"
    >
      <div class="message-detail">
        <div class="detail-item">
          <span class="label">消息类型：</span>
          <el-tag :type="getMessageTypeTag(detailData.type)">
            {{ getMessageTypeLabel(detailData.type) }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">发送状态：</span>
          <el-tag :type="getStatusType(detailData.status)">
            {{ detailData.status }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="label">消息标题：</span>
          <span>{{ detailData.title }}</span>
        </div>
        <div class="detail-item">
          <span class="label">消息内容：</span>
          <div class="content">{{ detailData.content }}</div>
        </div>
        <div class="detail-item">
          <span class="label">发送时间：</span>
          <span>{{ detailData.sendTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">目标用户：</span>
          <span>{{ detailData.targetCount }} 人</span>
        </div>
        <div class="detail-item">
          <span class="label">发送成功率：</span>
          <span>{{ detailData.successRate }}%</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import MultiLine from '@/components/MultiLine.vue'
const style = getComputedStyle(document.documentElement)
const getThemeColor = (varName) => style.getPropertyValue(varName).trim()

// 标签页激活状态
const activeTab = ref('overview')

// 消息统计数据
const messageStats = ref([
  {
    title: '站内消息',
    count: 156,
    type: 'primary',
    successRate: 98,
    openRate: 85
  },
  {
    title: '邮件推送',
    count: 89,
    type: 'success',
    successRate: 95,
    openRate: 76
  },
  {
    title: '短信推送',
    count: 64,
    type: 'warning',
    successRate: 99,
    openRate: 92
  }
])

// 趋势图相关
const chartPeriod = ref('week')
const trendData = computed(() => {
  if (chartPeriod.value === 'week') {
    return {
      xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      series: [
        {
          name: '站内消息',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '邮件推送',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '短信推送',
          data: [150, 232, 201, 154, 190, 330, 410]
        }
      ]
    }
  } else {
    return {
      xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        {
          name: '站内消息',
          data: [320, 332, 301, 334, 390, 330]
        },
        {
          name: '邮件推送',
          data: [220, 182, 191, 234, 290, 330]
        },
        {
          name: '短信推送',
          data: [150, 232, 201, 154, 190, 330]
        }
      ]
    }
  }
})

// 消息列表相关
const messageType = ref('')
const messageStatus = ref('')
const messageList = ref([
  {
    id: 1,
    title: '618活动通知',
    type: 'inapp',
    status: 'sent',
    sendTime: '2023-06-18 10:00:00',
    targetCount: 1000,
    successRate: 98.5
  }
  // ... 更多消息数据
])

// 消息表单相关
const messageDialog = ref({
  visible: false,
  type: 'create' // create 或 edit
})

const messageForm = ref({
  type: '',
  title: '',
  content: '',
  sendTime: '',
  targetUsers: []
})

const messageRules = {
  type: [{ required: true, message: '请选择消息类型' }],
  title: [{ required: true, message: '请输入消息标题' }],
  content: [{ required: true, message: '请输入消息内容' }],
  sendTime: [{ required: true, message: '请选择发送时间' }],
  targetUsers: [{ required: true, message: '请选择目标用户' }]
}

// 用户分组数据
const userGroups = ref([
  { label: '全部用户', value: 'all' },
  { label: '新注册用户', value: 'new' },
  { label: '活跃用户', value: 'active' },
  { label: '流失用户', value: 'lost' }
])

// 辅助函数
const getMessageTypeTag = (type) => {
  const types = {
    inapp: 'primary',
    email: 'success',
    sms: 'warning'
  }
  return types[type] || 'info'
}

const getMessageTypeLabel = (type) => {
  const labels = {
    inapp: '站内消息',
    email: '邮件',
    sms: '短信'
  }
  return labels[type] || type
}

const getStatusType = (status) => {
  const types = {
    pending: 'info',
    sending: 'warning',
    sent: 'success',
    failed: 'danger'
  }
  return types[status] || 'info'
}

// 事件处理函数
const createMessage = () => {
  messageDialog.value = {
    visible: true,
    type: 'create'
  }
  messageForm.value = {
    type: '',
    title: '',
    content: '',
    sendTime: '',
    targetUsers: []
  }
}

const editMessage = (row) => {
  messageDialog.value = {
    visible: true,
    type: 'edit'
  }
  messageForm.value = { ...row }
}

const submitMessage = () => {
  // TODO: 实现消息提交逻辑
  messageDialog.value.visible = false
}

// 消息详情相关
const messageDetailDialog = ref({
  visible: false
})

const messageDetail = ref({
  title: '',
  type: '',
  status: '',
  sendTime: '',
  targetCount: 0,
  successRate: 0,
  content: '',
  stats: {
    success: 0,
    failed: 0,
    opened: 0
  }
})

const viewMessageDetail = (row) => {
  messageDetailDialog.value.visible = true
  // 模拟获取详细数据
  messageDetail.value = {
    ...row,
    content: '这是消息的详细内容...',
    stats: {
      success: Math.floor((row.targetCount * row.successRate) / 100),
      failed: Math.floor(row.targetCount * (1 - row.successRate / 100)),
      opened: Math.floor(row.targetCount * 0.8)
    }
  }
}

const detailDialog = reactive({
  visible: false
})

const detailData = ref({
  type: '',
  status: '',
  title: '',
  content: '',
  sendTime: '',
  targetCount: 0,
  successRate: 0
})
</script>

<style scoped lang="less">
.user-reach {
  .stat-card {
    margin-bottom: 20px;

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-content {
      .stat-item {
        margin-bottom: 15px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .trend-chart {
    height: 400px;
  }

  .action-bar {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }

  .message-detail {
    .detail-item {
      margin-bottom: 16px;

      .label {
        display: inline-block;
        width: 100px;
        color: #606266;
      }

      .content {
        margin-top: 8px;
        padding: 12px;
        background-color: #f5f7fa;
        border-radius: 4px;
        min-height: 80px;
        white-space: pre-wrap;
      }
    }
  }
}

.stat-box {
  padding: 15px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 4px;

  .stat-label {
    color: #606266;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;

    &.text-success {
      color: var(--success);
    }

    &.text-danger {
      color: var(--error);
    }

    &.text-primary {
      color: var(--primary-color);
    }
  }
}
</style>