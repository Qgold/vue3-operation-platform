<template>
  <div
    class="cockpit-container"
    ref="cockpitRef"
  >
    <!-- 全屏按钮 -->
    <div
      class="fullscreen-btn"
      @click="toggleFullScreen"
    >
      <el-icon :size="20">
        <FullScreen v-if="!isFullscreen" />
        <Close v-else />
      </el-icon>
    </div>
    <!-- 顶部指标卡片 -->
    <div class="top-cards">
      <div class="metric-card">
        <div class="metric-title">当前人数</div>
        <div class="metric-value">1234</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">今年项目数</div>
        <div class="metric-value">11</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">合同签订数</div>
        <div class="metric-value">1234</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">政府政策激励</div>
        <div class="metric-value">1234</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">数字化转型项目完成进度</div>
        <div class="metric-value">100%</div>
      </div>
      <div class="metric-card double">
        <div class="metric-title">L3-L5级别已实布局化</div>
        <div class="metric-value">1234</div>
        <div class="metric-title">L3流程数字化</div>
        <div class="metric-value">1234</div>
      </div>
    </div>

    <!-- 中间主要内容区 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <div class="panel-title">项目参战人员</div>
        <div class="personnel-stats">
          <div class="stat-item">
            <div class="stat-value">1234</div>
            <div class="stat-label">总人数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">1234</div>
            <div class="stat-label">数字化人员</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">1234</div>
            <div class="stat-label">业务人员</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">1234</div>
            <div class="stat-label">供应商人员</div>
          </div>
        </div>
      </div>

      <!-- 中间地球显示区 -->
      <div class="earth-container">
        <div class="earth-visualization">
          <!-- 这里将使用Three.js渲染3D地球 -->
        </div>
        <div class="project-points">
          <!-- 项目点位将动态生成 -->
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <div class="panel-title">待办事项</div>
        <div class="todo-list">
          <div
            v-for="i in 4"
            :key="i"
            class="todo-item"
          >
            <div class="todo-date">2025-03-14</div>
            <div class="todo-content">这里是待办事项的详细项目内容，简要介绍。</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部图表区 -->
    <div class="bottom-charts">
      <div class="chart-container">
        <div class="chart-title">系统度量</div>
        <div class="chart-content">
          <!-- 将使用ECharts渲染图表 -->
        </div>
      </div>
      <div class="chart-container">
        <div class="chart-title">ITSM</div>
        <div class="chart-content">
          <!-- 将使用ECharts渲染图表 -->
        </div>
      </div>
      <div class="chart-container">
        <div class="chart-title">供应链管理</div>
        <div class="chart-content">
          <!-- 将使用ECharts渲染图表 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import * as THREE from 'three'
import * as echarts from 'echarts'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FullScreen, Close } from '@element-plus/icons-vue'
import screenfull from 'screenfull'

// 初始化地球
let scene,
  camera,
  renderer,
  controls,
  earth,
  rings = [],
  points = [],
  lines = []
const initEarth = () => {
  scene = new THREE.Scene()

  // 设置相机
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 50

  // 设置渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true
  })

  // 获取容器元素
  const container = document.querySelector('.earth-visualization')
  container.appendChild(renderer.domElement)

  // 设置渲染器尺寸为容器尺寸
  const updateSize = () => {
    const width = container.clientWidth
    const height = container.clientHeight

    // 更新相机宽高比
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    // 更新渲染器尺寸
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
  }

  // 初始化尺寸
  updateSize()

  // 监听窗口大小变化
  window.addEventListener('resize', updateSize)

  // 创建地球
  const earthGeometry = new THREE.SphereGeometry(18, 64, 64)
  const textureLoader = new THREE.TextureLoader()

  // 加载地球纹理
  const texture = textureLoader.load('/src/assets/earth-map.jpg')
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: texture,
    bumpScale: 0.05,
    specular: new THREE.Color(0x4444aa),
    shininess: 15
  })
  earth = new THREE.Mesh(earthGeometry, earthMaterial)
  scene.add(earth)

  // 添加大气层效果
  const atmosphereGeometry = new THREE.SphereGeometry(18.4, 64, 64)
  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    uniforms: {
      intensity: { value: 0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float intensity;
      void main() {
        float rim = 1.0 - abs(dot(normalize(vPosition), vNormal));
        gl_FragColor = vec4(0.3, 0.6, 1.0, pow(rim, 2.5) * intensity);
      }
    `
  })
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
  scene.add(atmosphere)

  // 创建环形平台
  const platformCount = 3
  const platformRadiusStart = 22
  const platformGap = 3

  for (let i = 0; i < platformCount; i++) {
    const radius = platformRadiusStart + i * platformGap
    const ringGeometry = new THREE.RingGeometry(radius, radius + 0.3, 128)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    scene.add(ring)
    rings.push(ring)
  }

  // 创建项目点位
  const projectPoints = [
    { name: 'P1', angle: 0 },
    { name: 'P2', angle: Math.PI * 0.25 },
    { name: 'P3', angle: Math.PI * 0.5 },
    { name: 'P4', angle: Math.PI * 0.75 },
    { name: 'P5', angle: Math.PI },
    { name: 'P6', angle: Math.PI * 1.25 },
    { name: 'P7', angle: Math.PI * 1.5 }
  ]

  projectPoints.forEach((project, index) => {
    const radius = platformRadiusStart + (index % 3) * platformGap
    const pointGeometry = new THREE.SphereGeometry(0.15, 16, 16)
    const pointMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.8
    })
    const point = new THREE.Mesh(pointGeometry, pointMaterial)

    // 计算点位置
    point.position.x = Math.cos(project.angle) * radius
    point.position.z = Math.sin(project.angle) * radius
    point.position.y = -0.5 - (index % 3) * 0.5

    scene.add(point)
    points.push(point)

    // 创建连接线
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.3
    })

    const linePoints = []
    linePoints.push(new THREE.Vector3(0, 0, 0))
    linePoints.push(point.position)

    lineGeometry.setFromPoints(linePoints)
    const line = new THREE.Line(lineGeometry, lineMaterial)
    scene.add(line)
    lines.push(line)
  })

  // 添加环境光和点光源
  const ambientLight = new THREE.AmbientLight(0x333333)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0x00f2fe, 1, 100)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 3, 5)
  scene.add(directionalLight)

  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.rotateSpeed = 0.5
  controls.minDistance = 45
  controls.maxDistance = 80

  animate()
}

// 动画循环
const animate = () => {
  requestAnimationFrame(animate)

  // 地球自转
  earth.rotation.y += 0.001

  // 环形平台旋转
  rings.forEach((ring, index) => {
    ring.rotation.y += 0.002 * (index + 1)
  })

  // 项目点位呼吸效果
  points.forEach((point, index) => {
    point.scale.setScalar(1 + Math.sin(Date.now() * 0.003 + index) * 0.1)
  })

  // 连接线动画
  lines.forEach((line, index) => {
    const material = line.material
    material.opacity = 0.3 + Math.sin(Date.now() * 0.002 + index) * 0.2
  })

  controls.update()
  renderer.render(scene, camera)
}

// 初始化图表
const initCharts = () => {
  // 系统度量图表
  const systemChart = echarts.init(
    document.querySelector(
      '.bottom-charts .chart-container:nth-child(1) .chart-content'
    )
  )
  systemChart.setOption({
    grid: {
      top: 30,
      right: 20,
      bottom: 30,
      left: 50
    },
    xAxis: {
      type: 'category',
      data: ['1.0', '2.0', '3.0', '4.0系列', '5.0系列'],
      axisLine: {
        lineStyle: { color: '#4b5bab' }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { color: '#4b5bab' }
      },
      splitLine: {
        lineStyle: { color: 'rgba(75, 91, 171, 0.3)' }
      }
    },
    series: [
      {
        data: [20.4, 39.5, 60.0, 30.5, 88.6],
        type: 'bar',
        barWidth: '30%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#00f2fe'
            },
            {
              offset: 1,
              color: '#1779ff'
            }
          ])
        }
      }
    ]
  })

  // 自适应
  window.addEventListener('resize', () => {
    systemChart.resize()
  })
}

const cockpitRef = ref(null)
const isFullscreen = ref(false)

// 切换全屏
const toggleFullScreen = () => {
  if (screenfull.isEnabled) {
    screenfull.toggle(cockpitRef.value)
    isFullscreen.value = !isFullscreen.value
  }
}

// 监听全屏变化
const handleFullscreenChange = () => {
  isFullscreen.value = screenfull.isFullscreen
}

onMounted(() => {
  initEarth()
  initCharts()

  // 添加全屏变化监听
  if (screenfull.isEnabled) {
    screenfull.on('change', handleFullscreenChange)
  }
})

// 组件卸载时移除监听
onUnmounted(() => {
  if (screenfull.isEnabled) {
    screenfull.off('change', handleFullscreenChange)
  }
  // 移除窗口大小变化监听
  window.removeEventListener('resize', updateSize)
})
</script>

<style scoped>
.cockpit-container {
  width: 100vw;
  height: 100vh;
  background-color: #0b1530;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

.fullscreen-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(15, 34, 89, 0.5);
  border: 1px solid #1d377d;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s;
}

.fullscreen-btn:hover {
  background: rgba(29, 55, 125, 0.8);
}

.top-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.metric-card {
  background: rgba(15, 34, 89, 0.5);
  border: 1px solid #1d377d;
  border-radius: 4px;
  padding: 15px;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #007aff, #00f2fe);
}

.metric-title {
  font-size: 14px;
  color: #7a8de6;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #00f2fe;
}

.double {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.main-content {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 20px;
  height: calc(100vh - 400px);
}

.left-panel,
.right-panel {
  background: rgba(15, 34, 89, 0.5);
  border: 1px solid #1d377d;
  border-radius: 4px;
  padding: 20px;
}

.panel-title {
  font-size: 16px;
  color: #7a8de6;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 3px solid #00f2fe;
}

.personnel-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: rgba(29, 55, 125, 0.3);
  border-radius: 4px;
}

.stat-value {
  font-size: 20px;
  color: #00f2fe;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #7a8de6;
}

.earth-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.earth-visualization {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.todo-item {
  padding: 10px;
  background: rgba(29, 55, 125, 0.3);
  border-radius: 4px;
}

.todo-date {
  font-size: 12px;
  color: #7a8de6;
  margin-bottom: 5px;
}

.todo-content {
  font-size: 14px;
  color: #fff;
}

.bottom-charts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  height: 300px;
}

.chart-container {
  background: rgba(15, 34, 89, 0.5);
  border: 1px solid #1d377d;
  border-radius: 4px;
  padding: 20px;
}

.chart-title {
  font-size: 16px;
  color: #7a8de6;
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 3px solid #00f2fe;
}

.chart-content {
  height: calc(100% - 40px);
}
</style>
