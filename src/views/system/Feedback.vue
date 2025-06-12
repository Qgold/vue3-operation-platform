<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const http = inject('http')
const textarea = ref('')
const feedbackType = ref('') // 新增反馈类型选择值
const router = useRouter()
// 反馈类型选项
const feedbackTypes = [
  { label: '功能建议', value: 'feature' },
  { label: '性能问题', value: 'performance' },
  { label: 'BUG反馈', value: 'bug' },
  { label: '其他', value: 'other' }
]

const submit = () => {
  // 更新提交方法，包含反馈类型
  http
    .get('/feedback', {
      content: textarea.value,
      type: feedbackType.value
    })
    .then((res) => {})
}
</script>
<template>
  <div class="about">
    <div class="title font-bold">意见反馈</div>
    <div class="flex justify-between align-center">
      <el-select
        v-model="feedbackType"
        placeholder="请选择反馈类型"
        class="feedback-type-select mb-4"
        style="width: 312px;"
      >
        <el-option
          v-for="item in feedbackTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        type="primary"
        @click="router.push('/system/record')"
      >反馈记录</el-button>
    </div>

    <el-input
      v-model="textarea"
      :rows="10"
      type="textarea"
      placeholder="请输入您的意见"
    />
    <footer class="footer">
      <el-button
        type="text"
        @click="textarea = ''"
        style="width: 60px;"
      >清空</el-button>
      <el-button
        type="primary"
        style="width: 60px;"
        @click="submit"
      >提交</el-button>
    </footer>
  </div>
</template>


<style scoped lang="less">
.title {
  font-size: 1.2rem;
  text-align: left;
  margin-bottom: 1.2rem;
}
.footer {
  margin-top: 20px;
}
.feedback-type-select {
  display: block;
  margin-bottom: 1.2rem;
}
:deep(.el-textarea) {
  width: 100% !important;
}
</style>

