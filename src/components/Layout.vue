<script setup>
import Header from './Header.vue'
import { useRouter } from 'vue-router'
import Menu from './Menu.vue'

import TabBar from './TabBar.vue'
import avator from '../assets/avator.jpg'
import { Headset } from '@element-plus/icons-vue'
const router = useRouter()
import { useAppStore } from '../store/app.js'
import { ref } from 'vue'
const showDrawer = ref(false)
const app = useAppStore()
const toggle = () => {
  app.setIsCollapse(!app.isCollapse)
}
const goFeedback = () => {
  showDrawer.value = true
  router.push('/system/detail')
}
</script>

<template>
  <div class="layout-container">
    <!-- 头部导航栏 -->
    <Header />

    <div class="main-content">
      <!-- 左侧菜单 -->
      <aside class="sidebar">
        <div class="menu-container">
          <Menu />
        </div>
        <div class="sidebar-bottom">
          <div class="icon-wrapper">
            <span
              class="iconfont icon-zidingyizhibiao"
              :class="{ 'rotate': app.isCollapse }"
              @click="toggle"
              title="折叠菜单"
            />
          </div>

        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="content">
        <div class="tab-container">
          <TabBar />
        </div>
        <div class="content-container">
          <div class="page-container">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component
                  :is="Component"
                  v-if="$route.meta.keepAlive"
                  :key="$route.fullPath"
                />
              </keep-alive>

              <component
                :is="Component"
                v-if="!$route.meta.keepAlive"
                :key="$route.fullPath"
              />
            </router-view>
          </div>
        </div>
        <div class="content-bottom">

          <div class="avatar-stack">
            <el-avatar
              class="stacked-avatar"
              size="small"
              :src="avator"
            />
            <el-avatar
              class="stacked-avatar"
              size="small"
              :src="avator"
            />
            <el-avatar
              class="stacked-avatar"
              size="small"
              :src="avator"
            />
            <el-avatar
              class="stacked-avatar"
              size="small"
              :src="avator"
            />
            <el-avatar
              class="stacked-avatar"
              size="small"
              :src="avator"
            />
            <el-avatar
              class="stacked-avatar"
              size="small"
              :src="avator"
            />
          </div>
        </div>
      </main>
    </div>

    <div
      class="fix-right"
      v-if="!['register','login'].includes($route.path)"
    >
      <el-popover
        placement="left-start"
        title=""
        :width="50"
        trigger="hover"
        content="联系方式： 19025117623"
      >

        <div
          class="font-bold  cursor-pointer flex "
          @click="router.push('/chat')"
        >
          <Headset style='width:20px; margin-right:10px;' />
          咨询客服
        </div>
        <template #reference>
          <div class="circle-btn"><i
              class="iconfont icon-kefu"
              style="font-size: 30px;"
            ></i></div>
        </template>
      </el-popover>
      <el-popover
        placement="left-start"
        title="意见反馈"
        :width="50"
        trigger="hover"
        content="这是一段文字"
      >
        <img
          :src="avator"
          class="avator cursor-pointer"
          @click="goFeedback"
        >
        <template #reference>
          <div class="circle-btn"><i
              class="iconfont icon-yijianfankui"
              style="font-size: 30px;"
            ></i></div>
        </template>
      </el-popover>

    </div>
    <el-drawer v-model="showDrawer"></el-drawer>
  </div>
</template>

<style scoped lang="less">
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  position: relative;
}

.main-content {
  display: flex;
  margin-top: var(--header-height);
  background: var(--bg-color);
  min-width: 1280px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0px;
}
.main-content::-webkit-scrollbar {
  display: none;
}
.sidebar {
  position: relative;
  background: var(--nav-bg);

  transition: width 0.3s;

  .menu-container {
    height: calc(100vh - var(--header-height) - var(--collapse-height) - 40px);
    overflow-y: auto;
  }

  .sidebar-bottom {
    position: absolute;
    bottom: calc(var(--footer-height) + 8px);
    left: 0;
    right: 0;
    height: var(--collapse-height);
    border-top: 1px solid var(--line-color);
    display: flex;
    justify-content: flex-end;
    padding-right: 0px;
    align-items: center;
  }
  .icon-wrapper {
    width: 32px;
    border-radius: 2px;
    height: 32px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .iconfont {
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
    color: var(--main-text-color);

    &.rotate {
      transform: rotate(180deg);
    }

    &:hover {
      color: var(--primary-color);
    }
  }

  &.collapsed {
    width: 64px;
  }
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.tab-container {
  position: fixed;
  top: var(--header-height);
  left: auto;
  z-index: 10;
  padding: 10px 0;
}

.content {
  flex: 1;
  position: relative;
  margin: 56px 16px 0 16px;
  background: var(--main-bg);
  border-radius: 4px;
  .content-container {
    height: calc(100vh - var(--header-height) - var(--footer-height) - 60px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
      background: var(--default-color);
    }
  }

  .content-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--footer-height);
    border-top: 10px solid var(--line-color);
    background: var(--footer-color);
    box-sizing: content-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    // padding-right: 20px;

    .avatar-stack {
      display: flex;
      align-items: center;
      // padding: 0 10px;

      .stacked-avatar {
        margin-right: -8px; // 负margin创建层叠效果
        border: 2px solid var(--footer-color); // 添加边框使层叠更清晰
        transition: all 0.3s ease;
        cursor: pointer;
        width: 24px;

        &:hover {
          transform: translateY(-5px); // 悬停时向上移动
          z-index: 1; // 确保悬停的头像在最上层
        }

        // 最后一个头像不需要负margin
        &:last-child {
          margin-right: 0;
        }
      }

      &:hover .stacked-avatar:not(:hover) {
        // 当鼠标悬停在组上时，未被悬停的头像稍微向下移动
        transform: translateY(2px);
      }
    }
  }

  .page-container {
    padding: 24px;
  }
}

.fix-right {
  position: fixed;
  right: 20px;
  bottom: calc(var(--footer-height) + 20px);
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1000;
}
.circle-btn {
  width: 48px;
  height: 48px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  font-size: 12px;
  margin-top: 20px;
}
.circle-btn:hover {
  background: white;
  color: var(--primary-color);
}
.avator {
  width: 60px;
  height: 60px;
}
</style>