<template>
  <div class="chat-container">
    <div
      class="chat-messages"
      ref="messagesContainer"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role === 'assistant' ? 'message-left' : 'message-right']"
      >
        <div class="message-avatar">
          <el-avatar
            :size="40"
            :src="message.role === 'assistant' ? assistantAvatar : userAvatar"
          />
        </div>
        <div class="message-content">
          <!-- 思考过程 -->
          <div
            v-if="message.thinking"
            class="thinking-process"
          >
            <div class="thinking-header">
              <el-icon>
                <Histogram />
              </el-icon>
              <span>思考过程</span>
            </div>
            <div
              class="thinking-content"
              v-html="renderMarkdown(message.thinking)"
            ></div>
          </div>
          <!-- 回答内容 -->
          <div
            class="message-bubble"
            v-html="renderMarkdown(message.content)"
          ></div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
      <!-- 加载指示器 -->
      <div
        v-if="loading"
        class="loading-indicator"
      >
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
        正在思考...
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="请输入您的问题..."
        @keyup.enter.prevent="sendMessage"
      />
      <div class="input-actions flex justify-between align-center">
        <el-select
          v-model="model"
          placeholder="选择模型"
        >
          <el-option
            v-for="item in models"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          type="primary"
          :loading="loading"
          @click="sendMessage"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Loading, Histogram } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { chatWithAI, getChatModels } from '@/api/chat'

// 配置 marked
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})
const models = ref([])
const model = ref('deepseek-reasoner')
// 头像URL
const assistantAvatar = new URL('@/assets/avator.jpg', import.meta.url).href
const userAvatar =
  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

// 聊天记录
const messages = ref([
  {
    role: 'assistant',
    content: '您好！我是您的智能客服助手，请问有什么可以帮您？',
    timestamp: Date.now()
  }
])

const inputMessage = ref('')
const loading = ref(false)
const messagesContainer = ref(null)
const chatHistory = ref([])

// Markdown 渲染函数
const renderMarkdown = (content) => {
  if (!content) return ''
  try {
    return marked(content)
  } catch (error) {
    console.error('Markdown parsing error:', error)
    return content
  }
}

// 格式化响应内容
const formatResponse = (text) => {
  if (!text) return ''
  return text
    .replace(/\\n/g, '\n')
    .replace(/\*\*/g, '**')
    .replace(/```(\w*)\n/g, '```$1\n')
    .trim()
}
const modelList = async () => {
  const { data } = await getChatModels()
  const ma = {
    'deepseek-reasoner': 'deepseek-R1',
    'deepseek-chat': 'deepseek-V3'
  }
  models.value = data.map((i) => ({ label: ma[i.id], value: i.id }))
}
// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || loading.value) return

  const userMessage = inputMessage.value.trim()

  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  })

  chatHistory.value.push({
    role: 'user',
    content: userMessage
  })

  inputMessage.value = ''
  await scrollToBottom()

  try {
    loading.value = true

    const response = await chatWithAI(chatHistory.value, model.value)
    const aiResponse = response.choices?.[0]?.message?.content
    const thinkingProcess = response.choices?.[0]?.message?.reasoning_content

    messages.value.push({
      role: 'assistant',
      content: formatResponse(aiResponse),
      thinking: formatResponse(thinkingProcess),
      timestamp: Date.now()
    })

    chatHistory.value.push({
      role: 'assistant',
      content: aiResponse
    })
  } catch (error) {
    ElMessage.error('对话失败，请稍后重试')
    console.error('Chat error:', error)
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 组件挂载时滚动到底部
onMounted(() => {
  scrollToBottom()
  modelList()
})
</script>

<style scoped lang='less'>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.message {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}

.message-left {
  flex-direction: row;
}

.message-right {
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 10px;
}

.message-content {
  max-width: 70%;
}

.thinking-process {
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
}

.thinking-header {
  display: flex;
  align-items: center;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 8px;
  gap: 4px;
}

.thinking-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
}

.message-left .message-bubble {
  background-color: #fff;
}

.message-right .message-bubble {
  background-color: #95ec69;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: center;
}

.chat-input {
  padding-top: 20px;
  background-color: #fff;
}

.input-actions {
  margin-top: 10px;
  display: flex;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  margin: 10px 0;
}

.loading-indicator .el-icon {
  margin-right: 8px;
}

:deep(.el-textarea__inner) {
  resize: none;
}

.el-select {
  width: 180px !important;
}
:deep(.message-bubble),
:deep(.thinking-content) {
  text-align: left;
  /* 代码块样式 */
  pre {
    background-color: #f6f8fa;
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;
    margin: 8px 0;
  }

  /* 行内代码样式 */
  code {
    background-color: #f6f8fa;
    padding: 2px 4px;
    border-radius: 4px;
    font-family: Monaco, Consolas, 'Courier New', monospace;
  }

  /* 段落样式 */
  p {
    margin: 8px 0;
    line-height: 1.6;
  }

  /* 列表样式 */
  ul,
  ol {
    padding-left: 20px;
    margin: 8px 0;
  }

  li {
    margin: 4px 0;
  }

  /* 引用样式 */
  blockquote {
    border-left: 4px solid #dcdfe6;
    margin: 8px 0;
    padding: 0 16px;
    color: #606266;
  }

  /* 表格样式 */
  table {
    border-collapse: collapse;
    margin: 8px 0;
    width: 100%;
  }

  th,
  td {
    border: 1px solid #dcdfe6;
    padding: 8px;
  }

  th {
    background-color: #f6f8fa;
  }

  /* 链接样式 */
  a {
    color: #409eff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
}
:deep(.el-textarea) {
  width: 100% !important;
}
</style>