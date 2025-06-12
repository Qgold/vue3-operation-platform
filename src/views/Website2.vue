<template>
  <div class="screen-container">
    <!-- 顶部数据统计 -->
    <div class="header-stats">
      <div
        class="stat-card"
        v-for="(stat, index) in stats"
        :key="index"
      >
        <div class="stat-title">{{ stat.title }}</div>
        <div
          class="stat-value"
          :ref="'statValue' + index"
        >{{ stat.value }}</div>
        <div
          class="stat-change"
          :class="{ 'positive': stat.change > 0 }"
        >
          {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧区域 -->
      <div class="side-panel">
        <div class="panel-card">
          <h3>实时访问数据</h3>
          <div
            class="scroll-list-container"
            ref="visitList"
          >
            <div class="scroll-list">
              <div
                v-for="(item, index) in visitData"
                :key="index"
                class="list-item"
              >
                <span class="time">{{ item.time }}</span>
                <span class="info">{{ item.info }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间地球区域 -->
      <div
        class="earth-container"
        ref="earthContainer"
      >
        <!-- Three.js 将在这里渲染地球 -->
      </div>

      <!-- 右侧区域 -->
      <div class="side-panel">
        <div class="panel-card">
          <h3>活跃城市 TOP10</h3>
          <div class="scroll-list-container">
            <div class="scroll-list">
              <div
                v-for="(city, index) in cityData"
                :key="index"
                class="list-item"
              >
                <span class="rank">{{ index + 1 }}</span>
                <span class="city">{{ city.name }}</span>
                <div class="progress-bar">
                  <div
                    class="progress"
                    :style="{ width: city.percentage + '%' }"
                  ></div>
                </div>
                <span class="value">{{ city.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部图表区域 -->
    <div class="footer-charts">
      <div class="chart-card">
        <h3>24小时趋势</h3>
        <div class="trend-chart">
          <div
            v-for="(item, index) in trendData"
            :key="index"
            class="trend-bar"
          >
            <div
              class="bar"
              :style="{ height: item.value + '%' }"
            ></div>
            <div class="label">{{ item.hour }}:00</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CountUp } from 'countup.js'
import { useTransition } from '@vueuse/core'
// 统计数据
const stats = ref([
  { title: '访问总量', value: 0, targetValue: 2345678, change: 12.5 },
  { title: '活跃用户', value: 0, targetValue: 128930, change: 5.8 },
  { title: '转化率', value: 0, targetValue: 25.6, change: -2.3 },
  { title: '平均停留', value: 0, targetValue: 6.8, change: 1.5 }
])

// 实时访问数据
const visitData = ref([])
const generateVisitData = () => {
  const data = []
  for (let i = 0; i < 50; i++) {
    const minutes = Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, '0')
    const seconds = Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, '0')
    data.push({
      time: `${minutes}:${seconds}`,
      info: `用户${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )} 访问了页面`
    })
  }
  return data
}

// 城市数据
const cityData = ref([
  { name: '北京', value: 1234, percentage: 100 },
  { name: '上海', value: 1100, percentage: 89 },
  { name: '广州', value: 980, percentage: 79 },
  { name: '深圳', value: 877, percentage: 71 },
  { name: '杭州', value: 766, percentage: 62 },
  { name: '成都', value: 654, percentage: 53 },
  { name: '武汉', value: 543, percentage: 44 },
  { name: '西安', value: 432, percentage: 35 },
  { name: '南京', value: 321, percentage: 26 },
  { name: '重庆', value: 210, percentage: 17 }
])

// 趋势数据
const trendData = ref(
  Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: Math.floor(Math.random() * 60 + 20)
  }))
)

// Three.js 相关变量
let scene, camera, renderer, controls, globe
const earthContainer = ref(null)

// 初始化3D场景
const initEarth = () => {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    75,
    earthContainer.value.clientWidth / earthContainer.value.clientHeight,
    0.1,
    1000
  )

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(
    earthContainer.value.clientWidth,
    earthContainer.value.clientHeight
  )
  earthContainer.value.appendChild(renderer.domElement)

  // 创建地球
  const geometry = new THREE.SphereGeometry(5, 64, 64)
  const texture = new THREE.TextureLoader().load('/src/assets/earth-map.jpg')
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    shininess: 5
  })

  globe = new THREE.Mesh(geometry, material)
  scene.add(globe)

  // 添加环境光和平行光
  const ambientLight = new THREE.AmbientLight(0x404040)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(10, 10, 10)
  scene.add(directionalLight)

  camera.position.z = 15

  // 添加轨道控制
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.rotateSpeed = 0.5

  animate()
}

// 动画循环
const animate = () => {
  requestAnimationFrame(animate)
  globe.rotation.y += 0.001
  controls.update()
  renderer.render(scene, camera)
}

// 初始化统计数字动画
const initCountUp = () => {
  stats.value.forEach((stat, index) => {
    const countUp = new CountUp(`statValue${index}`, stat.targetValue, {
      duration: 2500,
      separator: ',',
      decimal: '.'
    })
    countUp.start(() => {
      alert('22')
    })
  })
}

// 访问数据滚动效果
const startVisitScroll = () => {
  visitData.value = generateVisitData()
  setInterval(() => {
    visitData.value.push({
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      info: `用户${String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      )} 访问了页面`
    })
    visitData.value.shift()
  }, 3000)
}

// 监听窗口大小变化
const handleResize = () => {
  if (!earthContainer.value) return

  camera.aspect =
    earthContainer.value.clientWidth / earthContainer.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(
    earthContainer.value.clientWidth,
    earthContainer.value.clientHeight
  )
}

onMounted(() => {
  initEarth()
  initCountUp()
  startVisitScroll()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
.screen-container {
  width: 100vw;
  /* height: 100vh; */
  background: #041527;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.stat-title {
  font-size: 16px;
  color: #8fbbff;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-change {
  font-size: 14px;
  color: #ff4d4f;
}

.stat-change.positive {
  color: #52c41a;
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-card {
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  height: 100%;
}

.panel-card h3 {
  font-size: 16px;
  color: #8fbbff;
  margin: 0 0 15px 0;
}

.earth-container {
  width: 100%;
  height: 100%;
  background: rgba(0, 150, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.scroll-list-container {
  height: calc(100% - 440px);
  overflow: hidden;
  position: relative;
}

.scroll-list {
  animation: scroll 20s linear infinite;
}

.list-item {
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.time {
  color: #8fbbff;
  width: 60px;
}

.rank {
  width: 20px;
  text-align: center;
  color: #ffd700;
}

.city {
  width: 60px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #0088ff, #00bfff);
  transition: width 0.3s ease;
}

.value {
  width: 60px;
  text-align: right;
  color: #8fbbff;
}

.footer-charts {
  height: 200px;
}

.chart-card {
  background: rgba(0, 150, 255, 0.1);
  border: 1px solid rgba(0, 150, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  height: 100%;
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: calc(100% - 30px);
}

.trend-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #0088ff, #0044ff);
  transition: height 0.3s ease;
}

.label {
  font-size: 12px;
  color: #8fbbff;
}

@keyframes scroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.scroll-list:hover {
  animation-play-state: paused;
}
</style>