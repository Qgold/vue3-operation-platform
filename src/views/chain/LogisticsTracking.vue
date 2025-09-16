<template>
  <div class="logistics-tracking">

   <el-row>
    <el-form :model="searchForm">
      <el-form-item label="物流单号">
        <el-input
          v-model="searchForm.trackingNumber"
          placeholder="请输入物流单号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="searchLogistics"
        >查询物流</el-button>
      </el-form-item>
    </el-form>
   </el-row>
    

    <div
      v-if="currentLogistics"
      class="logistics-info"
    >
      <el-card class="tracking-card">
        <template #header>
          <div class="card-header">
            <span class="title">物流信息</span>
            <el-tag :type="getStatusType">{{ currentLogistics.status }}</el-tag>
          </div>
        </template>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">物流单号：</span>
            <span class="value">{{ currentLogistics.trackingNumber }}</span>
          </div>
          <div class="info-item">
            <span class="label">承运公司：</span>
            <span class="value">{{ currentLogistics.carrier }}</span>
          </div>
          <div class="info-item">
            <span class="label">预计送达：</span>
            <span class="value">{{ currentLogistics.estimatedDelivery }}</span>
          </div>
        </div>

        <div class="map-container">
          <div class="delivery-progress">
            <div class="progress-bar">
              <div
                :style="{ width: deliveryProgress + '%' }"
                class="progress-inner"
              ></div>
            </div>
            <div class="locations">
              <span>发货地</span>
              <span>当前位置</span>
              <span>目的地</span>
            </div>
          </div>
        </div>

        <div class="tracking-timeline">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in currentLogistics.trackingInfo"
              :key="index"
              :type="getTimelineItemType(activity.status)"
              :timestamp="activity.time"
            >
              <div class="timeline-content">
                <h4>{{ activity.location }}</h4>
                <p>{{ activity.description }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-card>
    </div>

    <el-empty
      v-else
      description="请输入物流单号查询物流信息"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = ref({
  trackingNumber: 'SF123456789'
})

const currentLogistics = ref(null)

// 模拟物流数据
const mockLogisticsData = {
  SF123456789: {
    trackingNumber: 'SF123456789',
    carrier: '顺丰速运',
    status: '运输中',
    estimatedDelivery: '2025-05-16',
    progress: 65,
    trackingInfo: [
      {
        time: '2025-05-14 14:30:00',
        location: '广州市花都区',
        description: '快件已到达【广州花都集散中心】',
        status: 'processing'
      },
      {
        time: '2025-05-14 11:20:00',
        location: '深圳市宝安区',
        description: '快件已从【深圳宝安集散中心】发出',
        status: 'success'
      },
      {
        time: '2025-05-14 09:15:00',
        location: '深圳市宝安区',
        description: '【深圳宝安集散中心】已收件',
        status: 'success'
      },
      {
        time: '2025-05-16 09:15:00',
        location: '徐州市云龙区',
        description: '圆梦花园小区已签收',
        status: 'success'
      }
    ]
  }
}

const deliveryProgress = computed(() => {
  return currentLogistics.value ? currentLogistics.value.progress : 0
})

const getStatusType = computed(() => {
  if (!currentLogistics.value) return ''
  const status = currentLogistics.value.status
  switch (status) {
    case '已签收':
      return 'success'
    case '运输中':
      return 'primary'
    case '派送中':
      return 'warning'
    case '异常':
      return 'danger'
    default:
      return 'info'
  }
})

const getTimelineItemType = (status) => {
  switch (status) {
    case 'success':
      return 'success'
    case 'processing':
      return 'primary'
    case 'warning':
      return 'warning'
    case 'error':
      return 'danger'
    default:
      return ''
  }
}

const searchLogistics = () => {
  if (!searchForm.value.trackingNumber) {
    ElMessage.warning('请输入物流单号')
    return
  }

  // 模拟 API 调用
  setTimeout(() => {
    const result = mockLogisticsData[searchForm.value.trackingNumber]
    if (result) {
      currentLogistics.value = result
      ElMessage.success('查询成功')
    } else {
      ElMessage.error('未找到相关物流信息')
      currentLogistics.value = null
    }
  }, 500)
}

onMounted(() => {
  searchLogistics()
})
</script>

<style scoped>
.logistics-tracking {
}

.search-container {
  margin-bottom: 20px;
}

.tracking-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  color: #909399;
  margin-right: 8px;
}

.value {
  color: var(--main-text-color);
  font-weight: 500;
}

.map-container {
  margin: 20px 0;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.delivery-progress {
  width: 100%;
}

.progress-bar {
  height: 8px;
  background-color: #e4e7ed;
  border-radius: 4px;
  margin-bottom: 10px;
}

.progress-inner {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
}

.locations {
  display: flex;
  justify-content: space-between;
  color: var(--assistant-text-color);
  font-size: 14px;
}

.tracking-timeline {
  margin-top: 30px;
}

.timeline-content {
  h4 {
    margin: 0;
    font-size: 16px;
    color: #303133;
  }

  p {
    margin: 5px 0 0;
    color: var(--assistant-text-color);
    font-size: 14px;
  }
}
:deep(.el-form-item__label) {
  width: auto !important;
}
</style>