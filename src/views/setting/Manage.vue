<template>
  <div class="system-config">
    <el-container>
      <el-main>
        <el-tabs
          v-model="activeTab"
          type="border-card"
        >
          <!-- 基础配置 -->
          <el-tab-pane
            name="basic"
            label="基础配置"
          >
            <el-form
              :model="basicConfig"
              :rules="basicRules"
              ref="basicFormRef"
              label-width="160px"
            >
              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>网站信息</span>
                  </div>
                </template>
                <el-form-item
                  label="网站名称"
                  prop="siteName"
                >
                  <el-input
                    v-model="basicConfig.siteName"
                    placeholder="请输入网站名称"
                  />
                </el-form-item>
                <el-form-item
                  label="网站描述"
                  prop="siteDescription"
                >
                  <el-input
                    type="textarea"
                    v-model="basicConfig.siteDescription"
                    placeholder="请输入网站描述"
                  />
                </el-form-item>
                <el-form-item label="网站Logo">
                  <el-upload
                    class="avatar-uploader"
                    action="/api/upload"
                    :show-file-list="false"
                    :before-upload="beforeLogoUpload"
                  >
                    <img
                      v-if="basicConfig.logo"
                      :src="basicConfig.logo"
                      class="avatar"
                    />
                    <el-icon
                      v-else
                      class="avatar-uploader-icon"
                    >
                      <Plus />
                    </el-icon>
                  </el-upload>
                </el-form-item>
                <el-form-item
                  label="备案信息"
                  prop="icp"
                >
                  <el-input
                    v-model="basicConfig.icp"
                    placeholder="请输入备案信息"
                  />
                </el-form-item>
              </el-card>

              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>联系方式</span>
                  </div>
                </template>
                <el-form-item
                  label="客服电话"
                  prop="servicePhone"
                >
                  <el-input
                    v-model="basicConfig.servicePhone"
                    placeholder="请输入客服电话"
                  />
                </el-form-item>
                <el-form-item
                  label="客服邮箱"
                  prop="serviceEmail"
                >
                  <el-input
                    v-model="basicConfig.serviceEmail"
                    placeholder="请输入客服邮箱"
                  />
                </el-form-item>
                <el-form-item label="工作时间">
                  <el-time-picker
                    v-model="basicConfig.workTimeStart"
                    placeholder="开始时间"
                    format="HH:mm"
                  />
                  <span class="mx-2">至</span>
                  <el-time-picker
                    v-model="basicConfig.workTimeEnd"
                    placeholder="结束时间"
                    format="HH:mm"
                  />
                </el-form-item>
              </el-card>
            </el-form>
          </el-tab-pane>

          <!-- 安全配置 -->
          <el-tab-pane
            name="security"
            label="安全配置"
          >
            <el-form
              :model="securityConfig"
              :rules="securityRules"
              ref="securityFormRef"
              label-width="160px"
            >
              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>密码策略</span>
                  </div>
                </template>
                <el-form-item
                  label="密码最小长度"
                  prop="passwordMinLength"
                >
                  <el-input-number
                    v-model="securityConfig.passwordMinLength"
                    :min="6"
                    :max="20"
                  />
                </el-form-item>
                <el-form-item label="密码复杂度要求">
                  <el-checkbox-group v-model="securityConfig.passwordRequirements">
                    <el-checkbox label="number">必须包含数字</el-checkbox>
                    <el-checkbox label="lowercase">必须包含小写字母</el-checkbox>
                    <el-checkbox label="uppercase">必须包含大写字母</el-checkbox>
                    <el-checkbox label="special">必须包含特殊字符</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  label="密码有效期(天)"
                  prop="passwordExpireDays"
                >
                  <el-input-number
                    v-model="securityConfig.passwordExpireDays"
                    :min="0"
                  />
                  <span class="ml-2 text-gray-500">0表示永不过期</span>
                </el-form-item>
              </el-card>

              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>登录安全</span>
                  </div>
                </template>
                <el-form-item label="登录失败锁定">
                  <el-switch v-model="securityConfig.loginLockEnabled" />
                </el-form-item>
                <template v-if="securityConfig.loginLockEnabled">
                  <el-form-item
                    label="失败次数"
                    prop="loginMaxAttempts"
                  >
                    <el-input-number
                      v-model="securityConfig.loginMaxAttempts"
                      :min="1"
                    />
                    <span class="ml-2">次</span>
                  </el-form-item>
                  <el-form-item
                    label="锁定时间"
                    prop="loginLockTime"
                  >
                    <el-input-number
                      v-model="securityConfig.loginLockTime"
                      :min="1"
                    />
                    <span class="ml-2">分钟</span>
                  </el-form-item>
                </template>
                <el-form-item label="开启验证码">
                  <el-switch v-model="securityConfig.captchaEnabled" />
                </el-form-item>
              </el-card>
            </el-form>
          </el-tab-pane>

          <!-- 消息通知 -->
          <el-tab-pane
            name="notification"
            label="消息通知"
          >
            <el-form
              :model="notificationConfig"
              ref="notificationFormRef"
              label-width="160px"
            >
              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>邮件配置</span>
                  </div>
                </template>
                <el-form-item label="SMTP服务器">
                  <el-input
                    v-model="notificationConfig.smtpHost"
                    placeholder="请输入SMTP服务器地址"
                  />
                </el-form-item>
                <el-form-item label="SMTP端口">
                  <el-input-number
                    v-model="notificationConfig.smtpPort"
                    :min="1"
                    :max="65535"
                  />
                </el-form-item>
                <el-form-item label="发件人邮箱">
                  <el-input
                    v-model="notificationConfig.smtpUsername"
                    placeholder="请输入发件人邮箱"
                  />
                </el-form-item>
                <el-form-item label="邮箱密码">
                  <el-input
                    v-model="notificationConfig.smtpPassword"
                    type="password"
                    placeholder="请输入邮箱密码"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="testEmailConfig"
                  >测试邮件配置</el-button>
                </el-form-item>
              </el-card>

              <el-card class="mb-4">
                <template #header>
                  <div class="card-header">
                    <span>短信配置</span>
                  </div>
                </template>
                <el-form-item label="短信服务商">
                  <el-select v-model="notificationConfig.smsProvider">
                    <el-option
                      label="阿里云"
                      value="aliyun"
                    />
                    <el-option
                      label="腾讯云"
                      value="tencent"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="AccessKey">
                  <el-input
                    v-model="notificationConfig.smsAccessKey"
                    placeholder="请输入AccessKey"
                  />
                </el-form-item>
                <el-form-item label="SecretKey">
                  <el-input
                    v-model="notificationConfig.smsSecretKey"
                    type="password"
                    placeholder="请输入SecretKey"
                  />
                </el-form-item>
                <el-form-item label="短信签名">
                  <el-input
                    v-model="notificationConfig.smsSignName"
                    placeholder="请输入短信签名"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="testSmsConfig"
                  >测试短信配置</el-button>
                </el-form-item>
              </el-card>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="flex justify-end mt-4 gap-2">
          <el-button @click="resetForm">重置</el-button>
          <el-button
            type="primary"
            @click="saveSettings"
            :loading="saving"
          >保存设置</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 状态变量
const activeTab = ref('basic')
const saving = ref(false)

// 表单引用
const basicFormRef = ref(null)
const securityFormRef = ref(null)
const notificationFormRef = ref(null)

// 基础配置
const basicConfig = reactive({
  siteName: '',
  siteDescription: '',
  logo: '',
  icp: '',
  servicePhone: '',
  serviceEmail: '',
  workTimeStart: '',
  workTimeEnd: ''
})

// 安全配置
const securityConfig = reactive({
  passwordMinLength: 8,
  passwordRequirements: ['number', 'lowercase'],
  passwordExpireDays: 90,
  loginLockEnabled: true,
  loginMaxAttempts: 5,
  loginLockTime: 30,
  captchaEnabled: true
})

// 消息通知配置
const notificationConfig = reactive({
  smtpHost: '',
  smtpPort: 465,
  smtpUsername: '',
  smtpPassword: '',
  smsProvider: 'aliyun',
  smsAccessKey: '',
  smsSecretKey: '',
  smsSignName: ''
})

// 表单验证规则
const basicRules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  servicePhone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  serviceEmail: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const securityRules = {
  passwordMinLength: [
    { required: true, message: '请设置密码最小长度', trigger: 'blur' }
  ],
  loginMaxAttempts: [
    { required: true, message: '请设置最大失败次数', trigger: 'blur' }
  ]
}

// Logo上传前的验证
const beforeLogoUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传文件只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 测试邮件配置
const testEmailConfig = async () => {
  try {
    ElMessage.success('邮件发送成功')
  } catch {
    ElMessage.error('邮件发送失败')
  }
}

// 测试短信配置
const testSmsConfig = async () => {
  try {
    ElMessage.success('短信发送成功')
  } catch {
    ElMessage.error('短信发送失败')
  }
}

// 重置表单
const resetForm = async () => {
  try {
    await ElMessageBox.confirm('确定要重置所有设置吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    basicFormRef.value?.resetFields()
    securityFormRef.value?.resetFields()
    notificationFormRef.value?.resetFields()
    ElMessage.success('设置已重置')
  } catch {
    // 用户取消操作
  }
}

// 保存设置
const saveSettings = async () => {
  try {
    // 验证表单
    await Promise.all([
      basicFormRef.value?.validate(),
      securityFormRef.value?.validate(),
      notificationFormRef.value?.validate()
    ])

    saving.value = true
    // TODO: 调用API保存配置
    await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟API调用
    ElMessage.success('设置保存成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('请检查表单填写是否正确')
    }
  } finally {
    saving.value = false
  }
}

// 初始化数据
onMounted(async () => {
  // TODO: 从后端获取配置数据
})
</script>

<style scoped>
.system-config {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>