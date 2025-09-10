<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'

import { useAppStore } from '../store/app'
import { useRouter } from 'vue-router'
const refreshRight = () => {}

const app = useAppStore()
const router = useRouter()
const formSize = ref('default')
const ruleFormRef = ref()

const isExpanded = ref(true)
const ruleForm = reactive({
  userName: '',
  gender: '',
  priority: '',
  date1: '',
  date2: '',
  hobby: [],
  cardType: '',
  cardNo: ''
})

const rules = reactive({
  userName: [
    { required: true, message: '请输入您的姓名', trigger: 'blur' },
    { min: 2, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  gender: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change'
    }
  ],
  priority: [
    {
      required: true,
      message: '请选择优先级',
      trigger: 'change'
    }
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change'
    }
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change'
    }
  ],
  hobby: [
    {
      type: 'array',
      // required: true,
      message: '请选择爱好',
      trigger: 'change'
    }
  ],
  cardType: [
    {
      required: true,
      message: '请选择证件类型',
      trigger: 'change'
    }
  ],
  cardNo: [{ required: true, message: '请输入证件号码', trigger: 'blur' }]
})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      localStorage.setItem('userInfo', JSON.stringify(ruleForm))
      localStorage.setItem('token', 'APPTEXT')
      localStorage.setItem('userName', ruleForm.userName)
      app.$patch({ userInfo: ruleForm })
      app.$patch({ token: 'APPTEXT' })
      app.$patch({ userName: ruleForm.userName })
      ElMessage.success('注册成功')
      setTimeout(() => {
        router.push('/index')
      }, 500)
    } else {
      ElMessage.error('表单错误')
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const options = Array.from({ length: 100 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`
}))
</script>

<template>
  <div class="register">
    <!-- 左侧整体容器：包含内容 + 拉手 -->
    <div
      class="left-wrapper"
      :style="{ transform: isExpanded ? 'translateX(0)' : 'translateX(-200px)' }"
    >
      <div class="left-content">
        <div
          class="left-item"
          @click="refreshRight()"
        >
          <i class="iconfont icon-simu"></i>
          <span>身份证原件</span>
          <i class="iconfont icon-chakangengduojigou-gaoliang"></i>
        </div>
        <div class="left-item">
          <i class="iconfont icon-cebianlan-piliangjiaoyiicon"></i>
          <span>营业执照</span>
          <i class="iconfont icon-chakangengduojigou-gaoliang"></i>
        </div>
        <div class="left-item">
          <i class="iconfont icon-daohang-yijianfankuiicon"></i>
          <span>银行卡原价</span>
          <i class="iconfont icon-chakangengduojigou-gaoliang"></i>
        </div>
        <div class="left-item">
          <i class="iconfont icon-cebianlan-simuicon"></i>
          <span>其他证件</span>
          <i class="iconfont icon-chakangengduojigou-gaoliang"></i>
        </div>
        <div class="left-item">
          <i class="iconfont icon-zidingyizhibiao"></i>
          <span>身份证原件</span>
          <i class="iconfont icon-chakangengduojigou-gaoliang"></i>
        </div>
      </div>
      <div
        class="drawer-handle"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? '◀' : '▶' }}
      </div>
    </div>

    <div class="right">

      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item
          label="姓名"
          prop="userName"
        >
          <el-input
            v-model="ruleForm.userName"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item
          label="性别"
          prop="gender"
        >
          <el-select
            v-model="ruleForm.gender"
            placeholder="请选择"
          >
            <el-option
              label="男"
              value="male"
            />
            <el-option
              label="女"
              value="female"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="优先级"
          prop="priority"
        >
          <el-select-v2
            v-model="ruleForm.priority"
            placeholder="请选择优先级"
            :options="options"
          />
        </el-form-item>
        <el-form-item
          label="出生日期"
          required
        >
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="ruleForm.date1"
                type="date"
                label="Pick a date"
                placeholder="Pick a date"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col
            class="text-center"
            :span="2"
          >
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                v-model="ruleForm.date2"
                label="Pick a time"
                placeholder="Pick a time"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item
          label="爱好"
          prop="hobby"
        >
          <el-checkbox-group v-model="ruleForm.hobby">
            <el-checkbox
              label="健身"
              name="type"
            />
            <el-checkbox
              label="骑行"
              name="type"
            />
            <el-checkbox
              label="跑步"
              name="type"
            />
            <el-checkbox
              label="篮球"
              name="type"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="证件类型"
          prop="cardType"
        >
          <el-radio-group v-model="ruleForm.cardType">
            <el-radio label="身份证" />
            <el-radio label="护照" />
            <el-radio label="港澳通行证" />
            <el-radio label="军官证" />
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="证件号码"
          prop="cardNo"
        >
          <el-input v-model="ruleForm.cardNo" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef)"
          >
            提交
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.register {
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
}

.left-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  z-index: 1;
  transition: transform 0.3s ease;
}

.left-content {
  height: 100%;
  background-color: #fff;
  width: 200px;
  box-sizing: border-box;
  .left-item {
    height: 60px;
    padding-left: 20px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    align-items: center;
    font-size: 1rem;
    color: #121212;
    cursor: pointer;
    span {
      margin-left: 10px;
      margin-right: auto;
    }
    &:hover {
      background-color: #f5f5f5;
    }
  }
}

.drawer-handle {
  width: 16px;
  height: 100px;
  background-color: white;
  color: var(--main-text-color);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
  border-radius: 0 6px 6px 0;
  margin-top: calc(50vh - 50px);
  border: 1px solid var(--main-text-color);

  // &:hover {
  //   background-color: #121212;
  // }
}

.right {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
  padding: 20px;
  background-color: #ffffff;
  margin-left: v-bind("isExpanded ? '0' : '-200px'");
  transition: margin-left 0.3s ease;
}
</style>