<script setup>
import { SuccessFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
const tip = ref('操作成功')
</script>

<template>
  <div class="container">
    <div class="upload-area">
      <el-icon
        class="icon"
        :size="64"
        color="#409eff"
      >
        <SuccessFilled />
      </el-icon>
      <div class="size-text">操作成功</div>
      <p class="description">这是一句描述文本这是一句描述文本这是一句描述文本</p>
      <div class="button-group">
        <el-button>次按钮</el-button>
        <el-button type="primary">主操作</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 140px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  border-radius: 8px;
}

.icon {
  margin-bottom: 16px;
}

.size-text {
  color: var(--main-text-color);
  margin-bottom: 20px;
  font-weight: bold;
}

.description {
  color: var(--assistant-text-color);
  margin-bottom: 24px;
  text-align: center;
  font-size: 14px;
}

.button-group {
  display: flex;
  gap: 6px;
}
</style>