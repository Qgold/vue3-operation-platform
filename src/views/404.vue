<template>
  <div class="not-found-container">
    <img
      :src="found"
      style="width:364px;height:292px;"
    >
    <h1 class="not-found-title">抱歉，您访问的页面不存在！</h1>
    <p class="not-found-tip">可以刷新试试或返回首页。</p>
    <div class="not-found-actions">
      <el-button @click="handleRefresh">刷新页面</el-button>
      <el-button
        type="primary"
        @click="goHome"
      >返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import found from '@/assets/404.png'

const router = useRouter()

const handleRefresh = () => {
  // window.location.reload()
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
}

.imgs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.not-found-title {
  font-size: 24px;
  color: var(--main-text-color);
  margin-bottom: 24px;
  margin-top: 100px;
  font-weight: bold;
}

.not-found-tip {
  font-size: 16px;
  color: var(--secondary-text-color);
  margin-bottom: 24px;
}

.not-found-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>