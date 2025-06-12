<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'
const props = defineProps({
  // 上传的地址
  action: {
    type: String,
    required: true
  },
  // 设置上传的请求头部
  headers: {
    type: Object,
    default: () => ({})
  },
  // 上传时附带的额外参数
  data: {
    type: Object,
    default: () => ({})
  },
  // 上传的文件字段名
  name: {
    type: String,
    default: 'file'
  },
  // 是否支持多选文件
  multiple: {
    type: Boolean,
    default: false
  },
  // 接受上传的文件类型，例如 .jpg,.png
  accept: {
    type: String,
    default: ''
  },
  // 文件列表的类型，text/picture/picture-card
  listType: {
    type: String,
    default: 'text'
  },
  // 是否自动上传
  autoUpload: {
    type: Boolean,
    default: true
  },
  // 是否显示已上传文件列表
  showFileList: {
    type: Boolean,
    default: true
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 文件大小限制，单位为MB
  maxSize: {
    type: Number,
    default: 10
  },
  // 最大允许上传个数
  limit: {
    type: Number,
    default: 5
  },
  // 初始文件列表
  fileList: {
    type: Array,
    default: () => []
  },
  // 提示文字
  tip: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:fileList',
  'success',
  'error',
  'exceed',
  'change',
  'remove'
])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 上传文件列表
const uploadFiles = ref(props.fileList)

// 上传组件ref
const uploadRef = ref()

const uploadStatus = computed(() => {
  return props.listType === 'picture-card' ? '点击上传图片' : ''
})

// 文件上传前的校验
const beforeUpload = (file) => {
  // 文件大小校验
  const isLtSize = file.size / 1024 / 1024 < props.maxSize
  if (!isLtSize) {
    ElMessage.error(`上传文件大小不能超过 ${props.maxSize}MB!`)
    return false
  }
  return true
}

// 文件上传成功
const handleSuccess = (response, uploadFile, uploadFiles) => {
  emit('success', { response, uploadFile, uploadFiles })
  emit('update:fileList', uploadFiles)
}

// 文件上传失败
const handleError = (error, uploadFile, uploadFiles) => {
  ElMessage.error('上传失败')
  emit('error', { error, uploadFile, uploadFiles })
}

// 文件超出个数限制
const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
  emit('exceed', { files, uploadFiles })
}

// 文件列表移除文件时的钩子
const handleRemove = (uploadFile, uploadFiles) => {
  emit('remove', { uploadFile, uploadFiles })
  emit('update:fileList', uploadFiles)
}

// 文件状态改变时的钩子
const handleChange = (uploadFile, uploadFiles) => {
  emit('change', { uploadFile, uploadFiles })
}

// 手动上传文件
const submit = () => {
  uploadRef.value?.submit()
}

// 清空已上传的文件列表
const clearFiles = () => {
  uploadRef.value?.clearFiles()
}
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
defineExpose({
  submit,
  clearFiles
})
</script>

<template>
  <div class="upload-component">
    <el-upload
      ref="uploadRef"
      v-model:file-list="uploadFiles"
      :action="action"
      :headers="headers"
      :data="data"
      :name="name"
      :multiple="multiple"
      :accept="accept"
      :list-type="listType"
      :auto-upload="autoUpload"
      :show-file-list="showFileList"
      :disabled="disabled"
      :limit="limit"
      :on-preview="handlePictureCardPreview"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      :on-change="handleChange"
      class="flex flex-col items-start"
    >
      <div
        v-if="listType === 'picture-card'"
        class="flex flex-col items-center justify-center"
      >
        <el-icon>
          <Plus />
        </el-icon>
        <span class="upload-text">{{ uploadStatus }}</span>
      </div>

      <template v-else>
        <div class="flex flex-row items-center justify-center w-[112px] h-[32px] border border-solid border-[var(--default-color)] rounded-[2px] cursor-pointer upload-button">
          <el-icon>
            <Upload />
          </el-icon>
          <span class="upload-text">点击上传</span>
        </div>
      </template>

      <template #tip>
        <div class="upload-tip">{{ tip }}</div>
      </template>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
        />
      </el-dialog>
    </el-upload>
  </div>
</template>

<style scoped lang="less">
.upload-component {
  .upload-tip {
    font-size: 12px;
    color: var(--assistant-text-color);
    margin-top: 8px;
  }
}

:deep(.el-upload-list__item) {
  transition: all 0.3s;
  &:hover {
    background-color: var(--el-color-primary-light-9);
  }
}

.upload-button {
  .upload-text {
    color: var(--assistant-text-color);
    font-size: 14px;
    margin-left: 6px;
  }
}
.upload-button:hover span {
  color: var(--hover-text-color);
}
.upload-button:active span {
  color: var(--primary-color);
}
.upload-button:hover {
  transition: all 0.3s;
  border: 1px solid var(--hover-text-color);
  :deep(.el-icon) {
    color: var(--hover-text-color);
  }
}

.upload-button:active {
  transition: all 0.3s;
  border: 1px solid var(--primary-color);
  :deep(.el-icon) {
    color: var(--primary-color);
  }
}
</style>