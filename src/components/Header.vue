<script setup>
import avator from '../assets/avator.jpg'
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../store/app.js'
import { useRouter } from 'vue-router'
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const search = ref(null)
const dialogVisible = ref(false)
const app = useAppStore()
const router = useRouter()
const { locale } = useI18n()
const theme = ref(localStorage.getItem('darkMode') == 'true' ? true : false)

function setTheme(isDark) {
  theme.value = isDark
  window.toggleDarkMode()
}

function changeLanguage(lang) {
  locale.value = lang
}

function goHome() {
  router.push('/')
}

function logout() {
  app.removeUserInfo()
  router.push('/login')
}
</script>
<template>
  <div class="flex flex-row bg-black fixed">
    <div
      class="font-bold text-2xl pl-5 leading-20"
      style="margin-right:auto;cursor:pointer; display: flex; align-items: center;"
      @click="goHome()"
    >
      <img
        class="logo"
        src="../assets/025.png"
        alt="logo"
        style="width: 40px; height: 40px;margin-right: 10px;"
      >
      <span
        class="welcome-text"
        :class="{ 'text-collapsed': app.isCollapse }"
      >{{ $t('welcome') }}</span>
    </div>

    <div class="header-controls">
      <!-- 搜索框 -->
      <el-input
        placeholder="请输入搜索内容"
        v-model="search"
        class="search-input"
      >
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
        <span class="dropdown-link">
          {{ $t('lanuage') }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
            <el-dropdown-item command="en-US">English</el-dropdown-item>
            <el-dropdown-item command="zh-TW">繁體中文</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 主题切换 -->
      <el-dropdown
        trigger="hover"
        @command="setTheme"
        class="header-item"
      >
        <span class="dropdown-link">
          {{ $t('theme') }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="false">浅色模式</el-dropdown-item>
            <el-dropdown-item :command="true">深色模式</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 用户信息 -->
      <div
        class="header-item user-info"
        title="退出登录"
        @click="dialogVisible=true;"
      >
        <span>{{ $t('welcomeU') }}，{{ app.userName }}</span>
        <el-avatar
          :size="32"
          :src="avator"
          class="ml-10"
        />
      </div>
    </div>

    <!-- 退出确认对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="提示"
      width="30%"
      :before-close="handleClose"
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
  color: var(--primary-color);
  background: var(--nav-bg);
  border-bottom: solid 1px var(--line-color);
  min-width: 1280px;
  z-index: 1000;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-right: 20px;
}

.search-input {
  width: 240px;
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
  font-size: 16px;
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
}

:deep(.el-dropdown-menu__item) {
  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
}
</style>
