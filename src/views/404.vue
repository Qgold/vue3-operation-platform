<template>
  <div class="not-found-container">
    <div class="not-found-content">
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
    <div class="imgs">
      <img
        :src="XC"
        style="width:73px;height:114px;"
      >

      <img
        :src="found"
        style="width:508px;height:157px;object-fit:contain;"
      >

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import XC from '@/assets/xc.png'
import found from '@/assets/404.png'

const router = useRouter()

const handleRefresh = () => {
  window.location.reload()
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 300px;
  background-color: white;

  padding-left: 118px;
  padding-right: 118px;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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