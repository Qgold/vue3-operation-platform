<script setup>
import avator from '../assets/avator.jpg'
import { ref } from 'vue'
import { useAppStore } from '../store/app.js'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
const search = ref(null)
const dialogVisible = ref(false)
const app = useAppStore()
const router = useRouter()
const theme = ref(localStorage.getItem('darkMode') == 'true' ? true : false)
function changeTheme() {
  window.toggleDarkMode()
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
  <div class="flex flex-row  bg-black fixed">
    <div
      class="font-bold text-2xl pl-5 leading-20;"
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
    <div class="flex-grow flex justify-start items-center hover ml-20">
      <el-input
        placeholder="请输入搜索内容"
        v-model="search"
      >
        <template #suffix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

    </div>
    <!-- <div class="flex-grow  flex justify-center items-center hover">
      <router-link to="/bigScreen"><span
          class="font-bold"
          style="font-size: 1.2rem;"
          title="猫咪才是最可爱的"
        >{{ $t('screen') }}</span></router-link>
    </div> -->

    <div class=" flex justify-end items-center hover">
      <div
        style="color:var(--text-color);"
        class="font-bold"
      >{{ $t('lanuage') }}:</div>
      <select v-model="$i18n.locale">
        <option value="en-US">English</option>
        <option value="zh-CN">中文</option>
        <option value="zh-TW">繁體中文</option>
      </select>

      <div class="flex-grow flex justify-end items-center hover ml-20">
        <div
          style="color:var(--text-color);"
          class="font-bold"
        >{{ $t('theme') }}:</div>
        <el-switch
          v-model="theme"
          class="ml-2"
          style="--el-switch-on-color: var(--primary-color); --el-switch-off-color: #969696;"
          @change="changeTheme"
        />
      </div>

      <div
        class="flex-grow flex justify-end items-center font-bold color-black mr-5 ml-20"
        title="退出登录"
        style="cursor: pointer;'"
        @click="dialogVisible=true;"
      >
        {{ $t('welcomeU')}}，{{ app.userName}}

        <el-avatar
          :size="32"
          :src="avator"
          class="ml-10"
        />

      </div>
    </div>
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
          <el-button @click=" dialogVisible= false">{{ $t('cancel') }}</el-button>
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
  .hover {
    &:hover {
      background: #ffffff30;
    }
    a {
      color: var(--primary-color);
      font-size: 14px;
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
</style>
