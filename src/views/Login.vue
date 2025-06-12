<script setup>
import { ref, inject, reactive, onMounted } from 'vue'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
import { useAppStore } from '../store/app'
import { useRouter } from 'vue-router'
const app = useAppStore()
const router = useRouter()
const loading = ref(false)
const rememberMe = ref(false)

const ruleFormRef = ref()
const ruleForm = reactive({
  userName: '',
  password: '',
  agreement: false
})

const rules = reactive({
  userName: [
    { required: true, message: '请输入您的姓名', trigger: 'blur' },
    { min: 2, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  agreement: [{ required: true, message: '请同意', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const http = inject('http')
function handleLogin(formEL) {
  loading.value = true
  submitForm(formEL)
  /* .generate-stars(50); */
}
function jumpToRegister() {
  http.get('/user/register').then((res) => {
    router.push('/register')
  })
}

const submitForm = async (formEl) => {
  if (!formEl) return

  await formEl.validate((valid, fields) => {
    if (valid) {
      http.get('/user/login').then((res) => {
        // 在登录成功后，如果选择了记住我，则保存账号密码
        if (rememberMe.value) {
          localStorage.setItem('rememberedUserName', ruleForm.userName)
          localStorage.setItem('rememberedPassword', ruleForm.password)
        }

        app.setUserInfo({ userName: ruleForm.userName, roleId: '1' })
        app.setToken('APPTEXT')
        app.setUserName(ruleForm.userName)

        // 初始化权限并设置当前角色权限
        app.initPermissions()
        app.setCurrentRolePermissions('1') // 这里使用实际的roleId

        setTimeout(() => {
          loading.value = false
          router.push('/index')
        }, 500)
      })
    } else {
      loading.value = false
      console.log('error submit!', fields)
    }
  })
}

const showPassword = ref(false)

// 初始化登录信息
const initLoginInfo = () => {
  const savedUserName = localStorage.getItem('rememberedUserName')
  const savedPassword = localStorage.getItem('rememberedPassword')
  if (savedUserName && savedPassword) {
    ruleForm.userName = savedUserName
    ruleForm.password = savedPassword
    rememberMe.value = true
  }
}

// 处理记住我的变化
const handleRememberMe = (checked) => {
  if (!checked) {
    localStorage.removeItem('rememberedUserName')
    localStorage.removeItem('rememberedPassword')
  }
}

// 在组件挂载时初始化
onMounted(() => {
  initLoginInfo()
})
</script>
<template>
  <div class="login-container">
    <!-- 背景动画效果 -->
    <div class="background-animation">
      <div class="light"></div>
      <div class="stars">
        <div
          v-for="n in 50"
          :key="n"
          class="star"
        ></div>
      </div>
    </div>

    <!-- 原有的雨滴效果 -->
    <div class="rain">
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="drop"></div>
      <div class="drop"></div>
    </div>

    <div
      class="login-form"
      :class="{ 'form-enter': true }"
    >
      <div class="header">
        <div class="font-bold text-2xl gradient-text">登录</div>
        <span
          class="register-link"
          @click="jumpToRegister"
        >注册</span>
      </div>

      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        size="default"
        label-width="auto"
        status-icon
      >
        <el-form-item
          label="用户名"
          prop="userName"
          class="form-item-animation"
        >
          <el-input
            v-model="ruleForm.userName"
            placeholder="请输入姓名"
            clearable
          >
            <template #prefix>
              <el-icon class="input-icon">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
          class="form-item-animation"
        >
          <el-input
            v-model="ruleForm.password"
            placeholder="请输入登录密码"
            :type="showPassword ? 'text' : 'password'"
            clearable
          >
            <template #prefix>
              <el-icon class="input-icon">
                <Lock />
              </el-icon>
            </template>
            <template #suffix>
              <el-icon
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              >
                <View v-if="showPassword" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item class="remember-me form-item-animation">
          <el-checkbox
            v-model="rememberMe"
            @change="handleRememberMe"
          >记住密码</el-checkbox>
        </el-form-item>

        <el-form-item class="agreement form-item-animation">
          <el-checkbox v-model="ruleForm.agreement" />
          <span class="agreement-text">
            我已仔细阅读并同意
            <a
              href="#"
              class="hover-effect"
            >《隐私条款》</a>和
            <a
              href="#"
              class="hover-effect"
            >《服务条款》</a>
          </span>
        </el-form-item>

        <el-form-item class="form-item-animation">
          <el-button
            type="primary"
            @click="handleLogin(ruleFormRef)"
            size="large"
            :loading="loading"
            class="submit-button"
          >
            <span class="button-text">{{ loading ? '登录中...' : '登录' }}</span>
            <div class="button-effect"></div>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 200px;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(45deg, #000428, #004e92);
  position: relative;
  overflow: hidden;
}

.background-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  .light {
    position: absolute;
    width: 150vw;
    height: 150vh;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    animation: rotate 20s linear infinite;
    transform-origin: 20% 100%;
  }

  .stars {
    position: absolute;
    width: 100%;
    height: 100%;

    .star {
      position: absolute;
      background: white;
      border-radius: 50%;
      width: 4px;
      height: 4px;
      animation: twinkle 2s infinite;
    }

    .loop(@n, @i: 1) when (@i =< @n) {
      .star:nth-child(@{i}) {
        @left: @i * 2;
        @top: mod(@i * 37, 90);
        left: @left * 1%;
        top: @top * 1%;
        animation-delay: (@i * 0.1s);
      }
      .loop(@n, (@i + 1));
    }

    .loop(50);
  }
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 2em 2.5em;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 400px;
  backdrop-filter: blur(10px);
  transform: translateX(100px);
  opacity: 0;
  animation: formEnter 0.8s ease-out forwards;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  margin-bottom: 20px;

  .gradient-text {
    background: linear-gradient(45deg, #004e92, #000428);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 28px;
  }

  .register-link {
    color: #004e92;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;

    &:hover {
      color: #000428;
      &:after {
        width: 100%;
      }
    }

    &:after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(45deg, #004e92, #000428);
      transition: width 0.3s;
    }
  }
}

.form-item-animation {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease-out forwards;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }
  &:nth-child(4) {
    animation-delay: 0.4s;
  }
  &:nth-child(5) {
    animation-delay: 0.5s;
  }
}

.input-icon {
  color: #004e92;
}

.submit-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  background: linear-gradient(45deg, #004e92, #000428);
  border: none;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 78, 146, 0.4);
  }

  .button-text {
    position: relative;
    z-index: 1;
  }

  .button-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #000428, #004e92);
    transform: translateX(-100%);
    transition: transform 0.5s;
  }
}

.hover-effect {
  color: var(--primary-color);
  text-decoration: none;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: #004e92;
    transition: width 0.3s;
  }

  &:hover:after {
    width: 100%;
  }
}

@keyframes formEnter {
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}

.el-input {
  height: 40px;
  .el-input__wrapper {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;

    &:hover,
    &:focus-within {
      box-shadow: 0 4px 12px rgba(0, 78, 146, 0.2);
    }
  }
}
</style>