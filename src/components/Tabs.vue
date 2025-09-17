<template>
  <div class="tabs-container">
    <div class="tabs-header">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ 'active': activeTab === index }"
        @click="selectTab(index)"
      >
        {{ tab.title }}
      </div>
      <div
        class="tab-indicator"
        :style="indicatorStyle"
      ></div>
    </div>

    <div class="tabs-content">
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          :key="activeTab"
          class="tab-panel"
        >
          {{ tabs[activeTab].content }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const tabs = reactive([
      { title: '大屏展示', path: '/list' },
      {
        title: '烟花事例',
        path: '/componetEax'
      },
      {
        title: '流式瀑布',
        path: '/componetFlow'
      },
      {
        title: '关于我们',
        path: '/about'
      },
      { title: '联系我们', path: '/tip' }
    ])

    const activeTab = ref(0)
    const tabPositions = reactive([])
    const router = useRouter()

    // 计算指示器样式
    const indicatorStyle = computed(() => {
      if (tabPositions.length === 0 || activeTab.value >= tabPositions.length) {
        return {}
      }

      const { left, width } = tabPositions[activeTab.value]
      return {
        left: `${left}px`,
        width: `${width}px`,
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    })

    // 选择标签页
    const selectTab = (index) => {
      activeTab.value = index
      router.push(tabs[index].path)
    }

    // 计算每个标签的位置和宽度
    const calculatePositions = () => {
      const tabElements = document.querySelectorAll('.tab-item')
      tabPositions.length = 0

      tabElements.forEach((tab) => {
        const rect = tab.getBoundingClientRect()
        const containerRect = tab.parentElement.getBoundingClientRect()

        tabPositions.push({
          left: rect.left - containerRect.left + 20,
          width: 20
        })
      })
    }

    onMounted(() => {
      calculatePositions()
      window.addEventListener('resize', calculatePositions)
    })

    return {
      tabs,
      activeTab,
      indicatorStyle,
      selectTab
    }
  }
}
</script>

<style scoped>
.tabs-container {
  margin-right: auto;
}

.tabs-header {
  display: flex;
  position: relative;
  padding: 0 20px;
}

.tab-item {
  font-size: 14px;
  line-height: 22px;
  padding: 10px 0 12px 0;
  margin-right: 32px;
  cursor: pointer;
  color: var(--main-text-color);
  position: relative;
  transition: color 0.3s ease;
  position: relative;
}

.tab-item:last-child {
  margin-right: 0;
}

.tab-item.active {
  color: var(--primary-color);
  font-weight: 500;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
  top: 46px;
}

.tabs-content {
  padding: 30px;
  min-height: 200px;
}

.tab-panel {
  font-size: 18px;
  line-height: 1.6;
  color: #444;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>