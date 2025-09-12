<script setup>
import avator from '../assets/avator.jpg'
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { useAppStore } from '../store/app.js'
import { useRouter } from 'vue-router'
import {
  Search,
  ArrowDown,
  CaretBottom,
  FullScreen,
  Close
} from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

import screenfull from 'screenfull'
const search = ref(null)
const dialogVisible = ref(false)
const app = useAppStore()
const router = useRouter()
const { locale } = useI18n()
const theme = ref(localStorage.getItem('darkMode') == 'true' ? true : false)
const select = ref('')
const isFullscreen = ref(false)

// 注入 mainRef
const mainRef = inject('mainRef')
function setTheme() {
  window.toggleDarkMode()
}

function changeLanguage(lang) {
  locale.value = lang
}

function goHome() {
  router.push('/')
}
// 切换全屏
const toggleFullScreen = () => {
  if (screenfull.isEnabled) {
    screenfull.toggle(mainRef.value)
    isFullscreen.value = !isFullscreen.value
  }
}

// 监听全屏变化
const handleFullscreenChange = () => {
  isFullscreen.value = screenfull.isFullscreen
}
function logout() {
  app.removeUserInfo()
  router.push('/login')
}

onMounted(() => {
  // 添加全屏变化监听
  if (screenfull.isEnabled) {
    screenfull.on('change', handleFullscreenChange)
  }
})
</script>
<template>
  <div class="flex flex-row bg-black fixed border-[1px] border-[var(--line-color)] border-solid">
    <div
      class="font-bold text-2xl pl-5 leading-20"
      style="margin-right:auto;cursor:pointer; display: flex; align-items: center;"
      @click="goHome()"
    >
      <img
        class="logo"
        src="../assets/Logo.png"
        alt="logo"
      >

    </div>

    <div class="header-controls">
      <!-- 搜索框 -->
      <el-input
        placeholder="请输入搜索内容"
        v-model="search"
        class="search-input"
      >
        <template #prepend>
          <el-select
            v-model="select"
            placeholder="请选择"
            style="width: 120px !important; "
          >
            <el-option
              label="Restaurant"
              value="1"
            />
            <el-option
              label="Order No."
              value="2"
            />
            <el-option
              label="Tel"
              value="3"
            />
          </el-select>
        </template>
        <template #suffix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

      <!-- 语言选择 -->
      <el-dropdown
        trigger="hover"
        @command="changeLanguage"
        class="header-item"
      >
        <img
          src="../assets/language.png"
          alt="语言"
          style="width: 24px; height: 24px; margin-right: 10px; cursor: pointer;"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
            <el-dropdown-item command="en-US">English</el-dropdown-item>
            <el-dropdown-item command="zh-TW">繁體中文</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <img
        src="../assets/theme.png"
        alt="主题"
        style="width: 24px; height: 24px; margin-right: 10px;cursor: pointer;"
        @click="setTheme"
      />
      <!-- 主题切换 -->
      <!-- <el-dropdown
        trigger="hover"
        @command="setTheme"
        class="header-item"
      >

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="false">浅色模式</el-dropdown-item>
            <el-dropdown-item command="true">深色模式</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown> -->

      <div
        style='margin-top:5px; cursor: pointer;'
        @click="toggleFullScreen"
        title="全屏切换"
      >
        <el-icon :size="20">
          <FullScreen v-if="!isFullscreen" />
          <Close v-else />
        </el-icon>
      </div>
      <!-- 用户信息 -->
      <div
        class="header-item user-info"
        title="退出登录"
        @click="dialogVisible=true;"
      >
        煜
      </div>
      <el-icon>
        <CaretBottom />
      </el-icon>
    </div>

    <!-- 退出确认对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="提示"
      width="30%"
      draggable
      append-to-body
      :close-on-click-modal="false"
    >
      <span>确认退出</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
          <el-button
            type="primary"
            @click="logout()"
          >
            {{ $t('confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="less">
.fixed {
  top: 0;
  position: fixed;
  font-size: 14px;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--header-height);
  color: var(--main-text-color);
  background: var(--nav-bg);
  border-bottom: solid 1px var(--line-color);
  min-width: 1280px;
}
.logo {
  height: 24px;
  margin-right: 10px;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast; /* Chrome/Safari */
  image-rendering: crisp-edges; /* Firefox */
  -ms-interpolation-mode: nearest-neighbor; /* IE */
  transform: translateZ(0); /* 开启GPU加速 */
  backface-visibility: hidden; /* 防止在某些浏览器中出现模糊 */
  perspective: 1000px; /* 提高渲染质量 */
}
.header-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-right: 20px;
}

.search-input {
  width: 300px !important;

  border: 1px solid white !important;
}

.el-input {
  // --el-input-border: 1px solid white !important;
  --el-input-border-color: white !important;
  // --el-input-bg-color: #ffffff30 !important;
}
.el-input-group__append,
.el-input-group__prepend {
  // background-color: #ffffff30 !important;
}

.header-item {
  height: var(--header-height);
  display: flex;
  align-items: center;
  color: var(--text-color);

  .dropdown-link {
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 12px;
    &:hover {
      color: var(--primary-color);
    }
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--primary-color);
      transition: width 0.3s ease-in-out;
    }

    &:hover::after {
      width: 100%;
    }
  }
}

.welcome-text {
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
  font-size: 18px;
  color: var(--primary-color);
}

.text-collapsed {
  width: 0;
  margin-right: 0;
  opacity: 0;
}

.user-info {
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e3e7;
  font-size: 20px;
  color: var(--info);
  justify-content: center;
}

:deep(.el-dropdown-menu__item) {
  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
}
</style>
