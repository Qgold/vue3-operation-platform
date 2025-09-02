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
        <!-- 悬浮提示框 -->
        <div
          class="project-tooltip"
          v-show="activeProject"
          :style="tooltipStyle"
        >
          <div class="tooltip-header">
            <span class="project-id">{{ activeProject?.name }}</span>
            <span class="project-title">{{ activeProject?.title }}</span>
          </div>
          <div class="tooltip-content">
            {{ activeProject?.description }}
          </div>
          <div class="tooltip-footer">
            <div class="stat">
              <div class="stat-label">进度</div>
              <div class="stat-value">{{ activeProject?.progress }}%</div>
            </div>
            <div class="stat">
              <div class="stat-label">预计完成</div>
              <div class="stat-value">{{ activeProject?.eta }}</div>
            </div>
          </div>
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
import { onMounted, ref, onUnmounted, reactive } from 'vue'
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

  // 创建底部圆盘
  const baseRadius = 25
  const discGeometry = new THREE.CylinderGeometry(
    baseRadius,
    baseRadius,
    0.5,
    64
  )
  const discMaterial = new THREE.MeshPhongMaterial({
    color: 0x1779ff,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
  })
  const disc = new THREE.Mesh(discGeometry, discMaterial)
  disc.position.y = -5
  scene.add(disc)

  // 创建发光边缘
  const edgeGeometry = new THREE.RingGeometry(baseRadius, baseRadius + 0.3, 64)
  const edgeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  })
  const edge = new THREE.Mesh(edgeGeometry, edgeMaterial)
  edge.rotation.x = Math.PI / 2
  edge.position.y = -4.7
  scene.add(edge)

  // 创建项目点位
  const projectPoints = projectData.map((project, index) => {
    const angle = (Math.PI * 2 * index) / projectData.length
    return { ...project, angle }
  })

  // 创建射线投射器用于鼠标交互
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  // 添加鼠标移动事件监听
  container.addEventListener('mousemove', (event) => {
    const rect = container.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(points)

    if (intersects.length > 0) {
      const point = intersects[0].object
      const index = points.indexOf(point)
      const project = projectData[index]

      // 更新提示框位置和内容
      const vector = new THREE.Vector3()
      vector.setFromMatrixPosition(point.matrixWorld)
      vector.project(camera)

      const x = (vector.x * rect.width) / 2 + rect.width / 2
      const y = -(vector.y * rect.height) / 2 + rect.height / 2

      tooltipStyle.left = `${x + 20}px`
      tooltipStyle.top = `${y - 20}px`
      activeProject.value = project

      // 高亮显示当前点位
      points.forEach((p, i) => {
        p.material.opacity = i === index ? 1 : 0.6
        p.scale.setScalar(i === index ? 1.5 : 1)
      })
    } else {
      activeProject.value = null
      points.forEach((p) => {
        p.material.opacity = 0.8
        p.scale.setScalar(1)
      })
    }
  })

  projectPoints.forEach((project, index) => {
    const radius = baseRadius * 0.8
    const angle = project.angle - Math.PI / 2 // 调整起始角度

    // 创建标记点组
    const markerGroup = new THREE.Group()

    // 创建底部圆盘
    const baseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32)
    const baseMaterial = new THREE.MeshPhongMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.8
    })
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    base.position.y = 0

    // 创建三角形箭头
    const arrowShape = new THREE.Shape()
    arrowShape.moveTo(-0.3, 0)
    arrowShape.lineTo(0.3, 0)
    arrowShape.lineTo(0, 0.8)
    arrowShape.lineTo(-0.3, 0)

    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: false
    }

    const arrowGeometry = new THREE.ExtrudeGeometry(arrowShape, extrudeSettings)
    const arrowMaterial = new THREE.MeshPhongMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9
    })

    const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial)
    arrow.position.set(0, 0.2, -0.05)

    // 创建顶部圆盘（带文字）
    const topDiscGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.15, 32)
    const topDiscMaterial = new THREE.MeshPhongMaterial({
      color: 0x1779ff,
      transparent: true,
      opacity: 0.9
    })
    const topDisc = new THREE.Mesh(topDiscGeometry, topDiscMaterial)
    topDisc.position.y = 1.2

    // 创建发光边缘
    const edgeGeometry = new THREE.TorusGeometry(0.8, 0.05, 16, 32)
    const edgeMaterial = new THREE.MeshPhongMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8
    })
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial)
    edge.rotation.x = Math.PI / 2
    edge.position.y = 1.2

    // 创建文字标签
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 128
    canvas.height = 128
    context.fillStyle = '#00f2fe'
    context.font = 'bold 64px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(project.name, 64, 64)

    const textTexture = new THREE.CanvasTexture(canvas)
    const textGeometry = new THREE.PlaneGeometry(1.2, 1.2)
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      opacity: 1
    })

    const text = new THREE.Mesh(textGeometry, textMaterial)
    text.position.y = 1.2
    text.position.z = 0.08
    text.rotation.x = -Math.PI / 2

    // 将所有部件添加到组中
    markerGroup.add(base)
    markerGroup.add(arrow)
    markerGroup.add(topDisc)
    markerGroup.add(edge)
    markerGroup.add(text)

    // 设置标记点位置
    markerGroup.position.x = Math.cos(angle) * radius
    markerGroup.position.z = Math.sin(angle) * radius
    markerGroup.position.y = -4.7

    scene.add(markerGroup)
    points.push(topDisc) // 用顶部圆盘作为交互检测对象
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
  points.forEach((disc, index) => {
    // 获取标记点组的所有子元素
    const group = disc.parent
    const arrow = group.children[1]
    const edge = group.children[3]

    // 箭头上下浮动动画
    arrow.position.y = 0.2 + Math.sin(Date.now() * 0.003 + index) * 0.1

    // 边缘发光动画
    edge.material.emissiveIntensity =
      0.5 + Math.sin(Date.now() * 0.002 + index) * 0.3
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
const activeProject = ref(null)
const tooltipStyle = reactive({
  left: '0px',
  top: '0px'
})

const projectData = [
  {
    name: 'P1',
    title: '智能 BOM 平台建设项目',
    description:
      '建设智能BOM管理平台，实现产品数据的全生命周期管理，提升研发效率。',
    progress: 85,
    eta: '2025-10'
  },
  {
    name: 'P2',
    title: '产品存一体化实施',
    description: '打通产品设计与库存管理系统，实现从设计到库存的无缝衔接。',
    progress: 65,
    eta: '2025-12'
  },
  {
    name: 'P3',
    title: 'ERP+CRM+WMS全球系统',
    description: '构建全球化的企业资源计划系统，提升企业运营效率。',
    progress: 45,
    eta: '2026-03'
  },
  {
    name: 'P4',
    title: '海外一体化运营平台',
    description: '搭建海外业务统一运营平台，实现全球业务协同。',
    progress: 30,
    eta: '2026-06'
  },
  {
    name: 'P5',
    title: 'ERP专项升级项目',
    description: '对现有ERP系统进行升级改造，增加智能化功能模块。',
    progress: 70,
    eta: '2025-11'
  },
  {
    name: 'P6',
    title: '产品/物料开发效能',
    description: '提升产品与物料开发效率，缩短研发周期。',
    progress: 55,
    eta: '2026-01'
  },
  {
    name: 'P7',
    title: '人力资源运营模式转型',
    description: '优化人力资源管理流程，建设数字化人才管理平台。',
    progress: 90,
    eta: '2025-09'
  }
]

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
  border: 1px solid rgba(23, 121, 255, 0.3);
  border-radius: 4px;
  padding: 15px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0, 242, 254, 0.05),
    0 0 15px rgba(0, 242, 254, 0.1);
  animation: borderGlow 3s ease-in-out infinite;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #007aff, #00f2fe);
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.5);
}

.metric-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(0, 242, 254, 0.1) 0%,
    rgba(0, 242, 254, 0) 60%
  );
  pointer-events: none;
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
  border: 1px solid rgba(23, 121, 255, 0.3);
  border-radius: 4px;
  padding: 20px;
  position: relative;
  box-shadow: inset 0 0 30px rgba(0, 242, 254, 0.05),
    0 0 20px rgba(0, 242, 254, 0.1);
  animation: panelGlow 4s ease-in-out infinite;
}

.left-panel::before,
.right-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid rgba(0, 242, 254, 0.3);
  border-radius: 4px;
  pointer-events: none;
  animation: borderPulse 4s ease-in-out infinite;
}

.left-panel::after,
.right-panel::after {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(0, 122, 255, 0.5),
    rgba(0, 242, 254, 0.8),
    rgba(0, 122, 255, 0.5)
  );
  box-shadow: 0 0 15px rgba(0, 242, 254, 0.5);
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

.project-tooltip {
  position: absolute;
  background: rgba(13, 25, 58, 0.95);
  border: 1px solid #1779ff;
  border-radius: 8px;
  padding: 15px;
  width: 280px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 242, 254, 0.15);
  z-index: 1000;
  pointer-events: none;
  transition: all 0.3s ease;
}

.project-tooltip::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #007aff, #00f2fe);
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.project-id {
  background: rgba(0, 242, 254, 0.2);
  color: #00f2fe;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.project-title {
  color: #fff;
  font-size: 16px;
}

.tooltip-content {
  color: #7a8de6;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.tooltip-footer {
  display: flex;
  gap: 20px;
}

.tooltip-footer .stat {
  flex: 1;
  background: rgba(29, 55, 125, 0.3);
  padding: 8px;
  border-radius: 4px;
  text-align: center;
}

.tooltip-footer .stat-label {
  font-size: 12px;
  color: #7a8de6;
  margin-bottom: 4px;
}

.tooltip-footer .stat-value {
  font-size: 16px;
  color: #00f2fe;
  font-weight: bold;
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
  border: 1px solid rgba(23, 121, 255, 0.3);
  border-radius: 4px;
  padding: 20px;
  position: relative;
  box-shadow: inset 0 0 30px rgba(0, 242, 254, 0.05),
    0 0 20px rgba(0, 242, 254, 0.1);
  animation: chartGlow 5s ease-in-out infinite;
}

.chart-container::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: linear-gradient(
    135deg,
    rgba(0, 242, 254, 0.5),
    rgba(23, 121, 255, 0.3),
    rgba(0, 242, 254, 0.1),
    rgba(23, 121, 255, 0.3)
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  animation: borderRotate 10s linear infinite;
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

@keyframes borderGlow {
  0%,
  100% {
    border-color: rgba(23, 121, 255, 0.3);
    box-shadow: inset 0 0 20px rgba(0, 242, 254, 0.05),
      0 0 15px rgba(0, 242, 254, 0.1);
  }
  50% {
    border-color: rgba(0, 242, 254, 0.5);
    box-shadow: inset 0 0 30px rgba(0, 242, 254, 0.1),
      0 0 20px rgba(0, 242, 254, 0.2);
  }
}

@keyframes panelGlow {
  0%,
  100% {
    border-color: rgba(23, 121, 255, 0.3);
    box-shadow: inset 0 0 30px rgba(0, 242, 254, 0.05),
      0 0 20px rgba(0, 242, 254, 0.1);
  }
  50% {
    border-color: rgba(0, 242, 254, 0.5);
    box-shadow: inset 0 0 40px rgba(0, 242, 254, 0.1),
      0 0 25px rgba(0, 242, 254, 0.2);
  }
}

@keyframes borderPulse {
  0%,
  100% {
    border-color: rgba(0, 242, 254, 0.3);
    opacity: 1;
  }
  50% {
    border-color: rgba(0, 242, 254, 0.1);
    opacity: 0.5;
  }
}

@keyframes chartGlow {
  0%,
  100% {
    box-shadow: inset 0 0 30px rgba(0, 242, 254, 0.05),
      0 0 20px rgba(0, 242, 254, 0.1);
  }
  50% {
    box-shadow: inset 0 0 40px rgba(0, 242, 254, 0.1),
      0 0 30px rgba(0, 242, 254, 0.2);
  }
}

@keyframes borderRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
