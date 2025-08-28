<template>
  <div class="tab-bar-container">
    <div
      class="nav-button prev"
      @click="scrollTabs('left')"
      :class="{ disabled: isScrollStart }"
    >
      <el-icon>
        <ArrowLeft />
      </el-icon>
    </div>

    <div class="tab-bar">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === tab.path }"
        @click="selectTab(tab.path)"
        @contextmenu.prevent="showContextMenu($event, tab, index)"
      >
        {{ tab.title }}
        <span
          class="close-btn"
          v-if='tabs.length > 1'
          @click.stop="closeTab(index,tab)"
        >×</span>
      </div>

      <!-- 右键菜单 -->
      <div
        v-if="contextMenu.visible"
        class="context-menu"
        :style="{
        left: contextMenu.x + 'px',
        top: contextMenu.y + 'px'
      }"
      >
        <div
          class="menu-item"
          @click="closeTab(contextMenu.tabIndex,contextMenu.currentTab)"
        >关闭当前标签</div>
        <div
          class="menu-item"
          @click="closeOtherTabs"
        >关闭其他标签</div>
        <div
          class="menu-item"
          @click="closeRightTabs"
        >关闭右侧标签</div>
      </div>

      <div
        class="nav-button next"
        @click="scrollTabs('right')"
        :class="{ disabled: isScrollEnd }"
      >
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, reactive, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../store/app'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
const app = useAppStore()
const route = useRoute()
const router = useRouter()
const tabs = ref([])
const currentTab = ref('')
// 新增右键菜单逻辑
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  currentTab: null,
  tabIndex: -1
})
// 监听路由变化，添加或更新 Tab
watch(
  () => route.path,
  (newPath) => {
    if (newPath !== currentTab.value) {
      const existingTab = tabs.value.find((tab) => tab.path === newPath)
      if (existingTab) {
        currentTab.value = newPath
      } else {
        const newTab = {
          path: newPath,
          title: route.meta.title || 'New Tab'
        }
        tabs.value.push(newTab)
        currentTab.value = newPath

        // 在下一个 tick 等待 DOM 更新后滚动到新 tab
        nextTick(() => {
          const tabBar = document.querySelector('.tab-bar')
          if (tabBar) {
            tabBar.scrollLeft = tabBar.scrollWidth - tabBar.clientWidth
          }
        })
      }
    }
  },
  { immediate: true }
)

// 选择 Tab
const selectTab = (path) => {
  currentTab.value = path
  router.push(path)
}

// 关闭 Tab
const closeTab = (index, tab) => {
  if (tabs.value.length > 1) {
    tabs.value.splice(index, 1)
    if (tab.path === currentTab.value) {
      const nextPath = tabs.value[index - 1]?.path || tabs.value[0].path
      currentTab.value = nextPath
      // 使用 replace 而不是 push，这样不会新增历史记录
      router.replace(nextPath).then(() => {
        // 修改当前历史记录，删除关闭的标签页的记录
        history.replaceState(null, '', nextPath)
      })
    } else {
      // 如果关闭的不是当前标签，也需要清理历史记录
      const currentPath = router.currentRoute.value.path
      history.replaceState(null, '', currentPath)
    }
    closeMenu()
  }
}

const showContextMenu = (e, tab, index) => {
  if (tabs.value.length === 1) {
    return
  }
  contextMenu.visible = true
  contextMenu.x = e.pageX
  contextMenu.y = e.pageY
  contextMenu.currentTab = tab
  contextMenu.tabIndex = index
}
const closeMenu = () => {
  contextMenu.visible = false
}

//关闭其他标签
const closeOtherTabs = () => {
  tabs.value = tabs.value.filter((t) => t.path === contextMenu.currentTab.path)
  // 使用 replace 替换当前历史记录
  router.replace(contextMenu.currentTab.path).then(() => {
    history.replaceState(null, '', contextMenu.currentTab.path)
  })
  closeMenu()
}

const closeRightTabs = () => {
  const currentIndex = tabs.value.findIndex((t) => t.path === currentTab.value)
  tabs.value = tabs.value.slice(0, contextMenu.tabIndex + 1)

  if (!tabs.value.some((t) => t.path === currentTab.value)) {
    const lastPath = tabs.value[tabs.value.length - 1].path
    router.replace(lastPath).then(() => {
      history.replaceState(null, '', lastPath)
    })
  } else {
    // 保持在当前页面，但清理历史记录
    history.replaceState(null, '', currentTab.value)
  }
  closeMenu()
}
// 点击外部关闭菜单
// 检查是否可以滚动
const isScrollStart = ref(true)
const isScrollEnd = ref(false)

// 滚动标签栏
const scrollTabs = (direction) => {
  const tabBar = document.querySelector('.tab-bar')
  if (tabBar) {
    const scrollAmount = 200 // 每次滚动的距离
    const newScrollLeft =
      direction === 'left'
        ? tabBar.scrollLeft - scrollAmount
        : tabBar.scrollLeft + scrollAmount

    tabBar.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }
}

// 检查滚动位置
const checkScroll = () => {
  const tabBar = document.querySelector('.tab-bar')
  if (tabBar) {
    isScrollStart.value = tabBar.scrollLeft <= 0
    isScrollEnd.value =
      tabBar.scrollLeft + tabBar.clientWidth >= tabBar.scrollWidth
  }
}

const clickOutsideHandler = (e) => {
  if (!e.target.closest('.context-menu')) {
    closeMenu()
  }
}

onMounted(() => {
  const tabBar = document.querySelector('.tab-bar')
  if (tabBar) {
    // 添加滚轮事件
    tabBar.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        tabBar.scrollLeft += e.deltaY
      }
    })

    // 添加滚动事件监听
    tabBar.addEventListener('scroll', checkScroll)

    // 初始检查滚动状态
    checkScroll()
  }
  document.addEventListener('click', clickOutsideHandler)
})

onUnmounted(() => {
  document.removeEventListener('click', clickOutsideHandler)
})
</script>

<style scoped lang="less">
.tab-bar-container {
  display: flex;
  align-items: center;
  position: relative;
  background-color: var(--bg-color);
  width: 100%;
}

.nav-button {
  position: sticky;
  top: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s;

  &.prev {
    left: 0;
    margin-right: 8px;
  }

  &.next {
    right: 0;
    margin-left: 0px;
  }

  &:hover:not(.disabled) {
    background-color: #e6e8eb;
    color: var(--primary-color);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    color: #c0c4cc;
  }
}

.tab-bar {
  display: flex;
  overflow-x: auto;
  background-color: var(--bg-color);
  flex: 1;
  scroll-padding-inline: 10px;
  scroll-behavior: smooth;
}
.tab-bar::-webkit-scrollbar {
  display: none;
  width: 0;
}
.tab-item {
  padding: 5px 18px;
  flex: 0 0 auto; /* 禁止缩放，保持原始大小 */
  margin-right: 10px;
  background-color: #f7faff;
  border-radius: 2px;
  cursor: pointer;
  position: relative;

  font-size: 12px;
  color: #555d6d;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-item.active {
  /* background-color: var(--primary-color); */
  /* color: white;
  color */
  color: var(--primary-color);
  background-color: white;
  font-weight: bold;
}
.tab-item:hover:not(.active) {
  color: var(--primary-color);
}
.close-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 12px;
}

.context-menu {
  position: fixed;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  z-index: 9999;
  min-width: 120px;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.menu-item:hover {
  background-color: #f5f5f5;
}
</style>