<template>
  <div class="group-form-container">
    <el-steps
      :active="currentStep"
      finish-status="success"
      align-center
    >
      <el-step title="营业执照信息" />
      <el-step title="公司法人信息" />
      <el-step title="道路运输经营许可证" />
      <el-step title="完成" />
    </el-steps>

    <div class="form-content">
      <!-- 步骤1：营业执照信息 -->
      <el-form
        v-if="currentStep === 0"
        :model="businessForm"
        :rules="businessRules"
        ref="businessFormRef"
        label-width="160px"
        class="step-form"
      >
        <el-form-item
          label="统一社会信用代码"
          prop="creditCode"
        >
          <el-input
            v-model="businessForm.creditCode"
            placeholder="请输入统一社会信用代码"
          />
        </el-form-item>
        <el-form-item
          label="企业类型"
          prop="businessType"
        >
          <el-input
            v-model="businessForm.businessType"
            placeholder="请输入企业类型"
          />
        </el-form-item>
        <el-form-item
          label="注册资本"
          prop="registeredCapital"
        >
          <el-input
            v-model="businessForm.registeredCapital"
            placeholder="请输入注册资本"
          />
        </el-form-item>
        <el-form-item
          label="经营范围"
          prop="businessScope"
        >
          <el-input
            type="textarea"
            v-model="businessForm.businessScope"
            placeholder="请输入经营范围"
          />
        </el-form-item>
      </el-form>

      <!-- 步骤2：公司法人信息 -->
      <el-form
        v-if="currentStep === 1"
        :model="legalForm"
        :rules="legalRules"
        ref="legalFormRef"
        label-width="120px"
        class="step-form"
      >
        <el-form-item
          label="证件类型"
          prop="idType"
        >
          <el-radio-group v-model="legalForm.idType">
            <el-radio label="id_card">身份证</el-radio>
            <el-radio label="passport">护照</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="法人姓名"
          prop="name"
        >
          <el-input
            v-model="legalForm.name"
            placeholder="请输入法人姓名"
          />
        </el-form-item>
        <el-form-item
          :label="idTypeLabel"
          prop="idNumber"
        >
          <el-input
            v-model="legalForm.idNumber"
            :placeholder="'请输入' + idTypeLabel"
          />
        </el-form-item>
      </el-form>

      <!-- 步骤3：道路运输经营许可证 -->
      <el-form
        v-if="currentStep === 2"
        :model="transportForm"
        :rules="transportRules"
        ref="transportFormRef"
        label-width="120px"
        class="step-form"
      >
        <el-form-item
          label="许可证号"
          prop="licenseNumber"
        >
          <el-input
            v-model="transportForm.licenseNumber"
            placeholder="请输入许可证号"
          />
        </el-form-item>
        <el-form-item
          label="业户名称"
          prop="businessName"
        >
          <el-input
            v-model="transportForm.businessName"
            placeholder="请输入业户名称"
          />
        </el-form-item>
        <el-form-item
          label="身份证号"
          prop="idNumber"
        >
          <el-input
            v-model="transportForm.idNumber"
            placeholder="请输入身份证号"
          />
        </el-form-item>
      </el-form>

      <!-- 步骤4：完成 -->
      <div
        v-if="currentStep === 3"
        class="completion-step"
      >
        <el-icon class="success-icon">
          <CircleCheckFilled />
        </el-icon>
        <h2>录入成功</h2>
        <div class="action-buttons">
          <el-button
            type="primary"
            @click="viewDetails"
          >查看详情</el-button>
          <el-button @click="createAgain">再次创建</el-button>
        </div>
        <div class="tip-text">
          您已完成全部信息录入，可以查看详情或继续创建新的表单
        </div>
      </div>
    </div>

    <div
      class="form-actions"
      v-if="currentStep !== 3"
    >
      <el-button
        v-if="currentStep > 0"
        @click="prevStep"
      >上一步</el-button>
      <el-button
        type="primary"
        @click="nextStep"
      >{{ currentStep === 2 ? '提交' : '下一步' }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CircleCheckFilled } from '@element-plus/icons-vue'

// 当前步骤
const currentStep = ref(0)

// 表单ref
const businessFormRef = ref()
const legalFormRef = ref()
const transportFormRef = ref()

// 营业执照信息表单
const businessForm = ref({
  creditCode: '',
  businessType: '',
  registeredCapital: '',
  businessScope: ''
})

// 公司法人信息表单
const legalForm = ref({
  idType: 'id_card',
  name: '',
  idNumber: ''
})

// 道路运输经营许可证表单
const transportForm = ref({
  licenseNumber: '',
  businessName: '',
  idNumber: ''
})

// 证件类型标签
const idTypeLabel = computed(() => {
  return legalForm.value.idType === 'id_card' ? '身份证号' : '护照号'
})

// 表单验证规则
const businessRules = {
  creditCode: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
  ],
  businessType: [
    { required: true, message: '请输入企业类型', trigger: 'blur' }
  ],
  registeredCapital: [
    { required: true, message: '请输入注册资本', trigger: 'blur' }
  ],
  businessScope: [
    { required: true, message: '请输入经营范围', trigger: 'blur' }
  ]
}

const legalRules = {
  idType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  name: [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
  idNumber: [{ required: true, message: '请输入证件号码', trigger: 'blur' }]
}

const transportRules = {
  licenseNumber: [
    { required: true, message: '请输入许可证号', trigger: 'blur' }
  ],
  businessName: [
    { required: true, message: '请输入业户名称', trigger: 'blur' }
  ],
  idNumber: [{ required: true, message: '请输入身份证号', trigger: 'blur' }]
}

// 下一步
const nextStep = async () => {
  let valid = false

  // 验证当前步骤的表单
  switch (currentStep.value) {
    case 0:
      valid = await businessFormRef.value.validate().catch(() => false)
      break
    case 1:
      valid = await legalFormRef.value.validate().catch(() => false)
      break
    case 2:
      valid = await transportFormRef.value.validate().catch(() => false)
      break
  }

  if (valid) {
    currentStep.value++
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 查看详情
const viewDetails = () => {
  // 实现查看详情逻辑
}

// 再次创建
const createAgain = () => {
  // 重置所有表单
  businessFormRef.value?.resetFields()
  legalFormRef.value?.resetFields()
  transportFormRef.value?.resetFields()
  currentStep.value = 0
}
</script>

<style scoped lang="less">
:deep(.el-step__head.is-process) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
:deep(.el-step__head.is-success) {
  border-color: var(--primary-color);
  color: var(--primary-color);
  font-weight: bold;
  .el-step__line {
    background: var(--primary-color);
  }
  .el-icon {
    color: var(--primary-color);
  }
}
:deep(.el-step__title.is-process) {
  color: var(--primary-color) !important;
}
:deep(.el-step__title.is-success) {
  color: var(--primary-color) !important;
}
.group-form-container {
  padding: 24px;
  background-color: #fff;

  .form-content {
    margin-top: 40px;

    .step-form {
      max-width: 600px;
      margin: 0 auto;
    }

    .completion-step {
      text-align: center;
      padding: 40px 0;

      .success-icon {
        font-size: 72px;
        color: #67c23a;
        margin-bottom: 16px;
      }

      h2 {
        font-size: 24px;
        color: #303133;
        margin-bottom: 24px;
      }

      .action-buttons {
        margin-bottom: 24px;

        .el-button {
          margin: 0 8px;
        }
      }

      .tip-text {
        display: inline-block;
        padding: 12px 20px;
        background-color: #f5f7fa;
        border-radius: 4px;
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .form-actions {
    margin-top: 40px;
    text-align: center;

    .el-button {
      margin: 0 8px;
      min-width: 100px;
    }
  }
}
</style>
