<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '../store/app.js'
import LineChart from '../components/LineChart.vue'
import RectChart from '../components/RectChart.vue'
import TreeChart from '../components/TreeChart.vue'
import Calendar from '../components/Calendar.vue'
import { useTransition } from '@vueuse/core'

const loading = ref(true)
const origin = ref(0)
const treeData = {
  name: '总公司',
  children: [
    {
      name: '技术部',
      children: [{ name: '开发组' }, { name: '测试组' }, { name: '运维组' }]
    },
    {
      name: '销售部',
      children: [{ name: '国内销售' }, { name: '海外销售' }]
    }
  ]
}
const outputValue = useTransition(origin, {
  duration: 1500,
  onFinished: () => {
    // origin.value = 100000
  }
})
origin.value = 1999999

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<template>
  <div
    class="card-container"
    v-loading="loading"
    element-loading-text="加载中..."
  >
    <div class="log-item">
      <div class="list">
        <el-statistic
          title="总阅读量"
          :value="outputValue"
        />
      </div>
      <div class="list">
        <el-statistic
          title="总下载量"
          :value="outputValue"
        />
      </div>
      <div class="list">
        <el-statistic
          title="总访问量"
          :value="outputValue"
        />
      </div>
    </div>

    <RectChart />
  </div>
</template>

<style scoped lang="less">
:deep(.el-statistic__number) {
  color: #ff6900 !important;
}
.card-container {
  width: 100%;
  height: 100%;
  overflow-y: auto; /* 添加滚动功能 */
  padding: 10px; /* 使用 padding 控制间距 */
}
.card-container::-webkit-scrollbar {
  display: none;
  width: 0;
}
.log-item {
  background-color: var(-card-bg);
  border: 2px solid #f5f5f5;
  border-radius: 4px;
  margin: 0; /* 移除原有的 margin */
  min-height: 100px;
  display: flex;
  flex: 1;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  &.direction-column {
    flex-direction: column;
  }
  .list {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.log-item:not(:first-child) {
  margin-top: 10px;
}

img,
.girl {
  height: 200px;
  width: 140px;
  margin: 10px;
  object-fit: cover;
  cursor: pointer;
  &.lorge {
    width: 280px;
    height: 400px;
  }
}
</style>