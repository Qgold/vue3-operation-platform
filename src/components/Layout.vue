<script setup>
import Header from './Header.vue'
import { useRouter } from 'vue-router'
import Menu from './Menu.vue'
import Footer from './Footer.vue'
import { ref, watchEffect } from 'vue'
import TabBar from './TabBar.vue'
import avator from '../assets/avator.jpg'
import { Headset } from '@element-plus/icons-vue'
const router = useRouter()

const goFeedback = () => {
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
        <Menu />
      </aside>

      <!-- 主内容区域 -->
      <main class="content">
        <!-- <div class="breadcrumb-container">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">promotion management</a></el-breadcrumb-item>
            <el-breadcrumb-item>promotion list</el-breadcrumb-item>
            <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
          </el-breadcrumb>
        </div> -->
        <div class="tab-container">
          <TabBar />
        </div>

        <div class="p-6">
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

      </main>

    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <Footer />
    </footer>

    <div
      class="fix-right"
      v-if="$route.path != '/login'"
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
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden; /* 新增 */
  width: 100vw;
  position: relative;
}

.main-content {
  display: flex;
  flex: 1;
  margin-top: var(--header-height);
  background: var(--bg-color);
  min-width: 1280px;
}
.main-content::-webkit-scrollbar {
  display: none;
}
.sidebar {
  background: var(--nav-bg);
  overflow-y: auto; /* 新增 */
  height: calc(100vh - var(--header-height) - var(--footer-height) - 10px);
}

.content {
  flex: 1;
  overflow-y: auto; /* 新增 */
  background: var(--main-bg);
  height: calc(
    100vh - var(--header-height) - var(--footer-height) - 68px
  ); /* 新增 */
  margin: 60px auto 0px 20px;
  border-radius: 4px;
}
.breadcrumb-container {
  position: absolute;
  top: 80px;
  left: auto;
  z-index: 10;
  padding: 10px 0;
}
.tab-container {
  position: absolute;
  top: var(--header-height);
  left: auto;
  z-index: 10;
  padding: 10px 0;
}

.footer {
  background: var(--nav-bg);
  border-top: 1px solid var(--line-color);
  width: 100vw;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  /* height: var(--footer-height); */
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