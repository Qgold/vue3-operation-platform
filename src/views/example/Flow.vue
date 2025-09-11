<script setup>
import { SuccessFilled } from '@element-plus/icons-vue'
import { ref, computed, onMounted } from 'vue'
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'food', name: '美食' },
  { id: 'travel', name: '旅行' },
  { id: 'fashion', name: '时尚' },
  { id: 'tech', name: '科技' },
  { id: 'home', name: '家居' },
  { id: 'fitness', name: '健身' },
  { id: 'photography', name: '摄影' },
  { id: 'books', name: '读书' },
  { id: 'work', name: '职场' },
  { id: 'other', name: '其他' }
])

// 当前激活的分类
const activeCategory = ref('all')

// 所有项目数据
const items = ref([])

// 当前显示的项目
const displayedItems = ref(12)

// 加载状态
const loading = ref(false)

// 是否还有更多数据
const hasMore = computed(() => {
  return filteredItems.value.length > displayedItems.value
})

// 过滤后的项目
const filteredItems = computed(() => {
  const filtered =
    activeCategory.value === 'all'
      ? items.value
      : items.value.filter((item) => item.category === activeCategory.value)

  return filtered.slice(0, displayedItems.value)
})

// 按分类过滤
const filterByCategory = (categoryId) => {
  activeCategory.value = categoryId
  displayedItems.value = 12
}

// 加载更多
const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    displayedItems.value += 8
    loading.value = false
  }, 800)
}

// 生成随机数据
const generateItems = () => {
  const titles = [
    '周末探店 | 隐藏在巷子里的宝藏咖啡店',
    '春日穿搭分享 | 温柔系女孩必备',
    '三亚旅行攻略 | 五天四晚人均2000',
    '自制健康早餐 | 5分钟搞定营养餐',
    '家居好物分享 | 提升幸福感的小物件',
    '护肤心得 | 敏感肌也能用的神仙产品',
    '健身打卡 | 30天马甲线养成计划',
    '摄影技巧 | 手机也能拍出大片感',
    '读书笔记 | 治愈系书单推荐',
    '职场穿搭 | 通勤也能很时尚'
  ]

  const descriptions = [
    '这家咖啡店的环境真的绝了，每个角落都适合拍照，咖啡味道也很棒！',
    '春天就是要穿得温柔一点，这套搭配既舒适又好看，适合日常穿搭。',
    '三亚真的太美了，海水清澈见底，这次旅行性价比超高，分享我的行程安排。',
    '早上时间紧张也能吃到营养早餐，分享我的快手早餐食谱，简单又健康。',
    '这些小物件让我的家变得更温馨了，价格不贵但幸福感满满。',
    '作为敏感肌，找到合适的护肤品太难了，这套组合用了三个月皮肤状态稳定多了。',
    '坚持健身一个月，体态明显变好了，分享我的训练计划和饮食安排。',
    '不用专业相机，手机也能拍出好看的照片，几个简单技巧分享给大家。',
    '最近读的几本书都很治愈，适合压力大的时候阅读，能让人放松下来。',
    '通勤穿搭也可以很时尚，这几套搭配既正式又不失时尚感，职场新人必备。'
  ]

  const users = [
    '旅行达人小美',
    '时尚博主Linda',
    '美食探索者',
    '健身教练Mike',
    '家居设计师',
    '护肤专家',
    '摄影爱好者',
    '读书人',
    '职场小白'
  ]

  const newItems = []

  for (let i = 0; i < 40; i++) {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)]
    const randomDesc =
      descriptions[Math.floor(Math.random() * descriptions.length)]
    const randomUser = users[Math.floor(Math.random() * users.length)]

    newItems.push({
      id: i + 1,
      title: randomTitle,
      description: randomDesc,
      user: randomUser,
      likes: Math.floor(Math.random() * 1000) + 100,
      category:
        categories.value[
          Math.floor(Math.random() * (categories.value.length - 1)) + 1
        ].id,
      image: `https://picsum.photos/300/400?random=${i}`,
      span: Math.floor(Math.random() * 10) + 20 // 随机高度
    })
  }

  return newItems
}

// 初始化数据
onMounted(() => {
  loading.value = true
  setTimeout(() => {
    items.value = generateItems()
    loading.value = false
  }, 1000)
})
</script>

<template>
  <div class="container">
    <header>
      <h1>小红书风格瀑布流</h1>

    </header>

    <div class="filter-bar">
      <button
        v-for="category in categories"
        :key="category.id"
        class="filter-btn"
        :class="{ active: activeCategory === category.id }"
        @click="filterByCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="waterfall-container">
      <transition-group name="fade">
        <div
          v-for="(item, index) in filteredItems"
          :key="item.id"
          class="card"
          :style="{ gridRowEnd: `span ${item.span}` }"
        >
          <img
            :src="item.image"
            :alt="item.title"
            class="card-image"
            loading="lazy"
          >
          <div class="card-content">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}</p>
            <div class="card-footer">
              <div class="user-info">
                <div class="avatar"></div>
                <span class="username">{{ item.user }}</span>
              </div>
              <div class="likes">
                <i>❤</i> {{ item.likes }}
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <div
      class="loading"
      v-if="loading"
    >加载中...</div>

    <button
      class="load-more"
      @click="loadMore"
      v-if="!loading && hasMore"
    >
      加载更多内容
    </button>
  </div>
</template>

<style scoped lang="less">
.container {
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  padding: 30px 0;
  margin-bottom: 30px;
}

h1 {
  font-size: 2.5rem;
  color: #ff2442;
  margin-bottom: 10px;
  font-weight: 600;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
}

.filter-bar {
  display: flex;
  justify-content: flex-start;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 20px;
  border-radius: 20px;
  background: white;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.filter-btn:hover,
.filter-btn.active {
  background: #ff2442;
  color: white;
  border-color: #ff2442;
}

.waterfall-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: 10px;
  grid-gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  grid-row-end: span 20;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: auto;
  display: block;
  background: #f5f5f5;
}

.card-content {
  padding: 15px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--line-color);
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 8px;
  background: #e0e0e0;
}

.username {
  font-size: 0.85rem;
  color: #666;
}

.likes {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #999;
}

.likes i {
  margin-right: 4px;
}

.loading {
  text-align: center;
  padding: 30px 0;
  font-size: 1rem;
  color: #888;
}

.load-more {
  display: block;
  width: 200px;
  margin: 30px auto;
  padding: 12px 20px;
  background: white;
  border: 1px solid #ff2442;
  color: #ff2442;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.load-more:hover {
  background: #ff2442;
  color: white;
}

@media (max-width: 768px) {
  .waterfall-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 15px;
  }

  h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .waterfall-container {
    grid-template-columns: 1fr;
  }

  .filter-bar {
    justify-content: flex-start;
    padding: 0 10px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>