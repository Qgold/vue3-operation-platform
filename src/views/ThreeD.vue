<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import gsap from 'gsap'

// 场景相关变量
let scene, camera, renderer, labelRenderer, controls
let warehouse = new THREE.Group() // 仓库组
let shelves = new Map() // 货架映射
const containerRef = ref(null)
const selectedShelfInfo = ref(null)
const isLoading = ref(true)

// 仓库配置
const warehouseConfig = {
  width: 200, // 仓库宽度
  length: 150, // 仓库长度
  height: 30, // 仓库高度
  shelfRows: 5, // 货架行数
  shelvesPerRow: 8, // 每行货架数
  shelfWidth: 20,
  shelfHeight: 20,
  shelfDepth: 8
}

// 初始化场景
const initScene = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  // 添加主光源
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
  mainLight.position.set(100, 100, 50)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 2048
  mainLight.shadow.mapSize.height = 2048
  mainLight.shadow.camera.near = 0.5
  mainLight.shadow.camera.far = 500
  scene.add(mainLight)

  // 添加补光
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
  fillLight.position.set(-50, 50, -50)
  scene.add(fillLight)

  // 添加顶部聚光灯
  const spotLight = new THREE.SpotLight(0xffffff, 0.5)
  spotLight.position.set(0, warehouseConfig.height - 5, 0)
  spotLight.angle = Math.PI / 4
  spotLight.penumbra = 0.1
  spotLight.decay = 2
  spotLight.distance = 200
  spotLight.castShadow = true
  scene.add(spotLight)

  // 添加仓库氛围光
  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5)
  scene.add(hemisphereLight)

  // 设置相机
  camera = new THREE.PerspectiveCamera(
    45,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    1,
    1000
  )
  camera.position.set(100, 100, 100)
  camera.lookAt(0, 0, 0)

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight
  )
  renderer.shadowMap.enabled = true
  containerRef.value.appendChild(renderer.domElement)

  // 标签渲染器
  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight
  )
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0'
  containerRef.value.appendChild(labelRenderer.domElement)

  // 添加控制器
  controls = new OrbitControls(camera, labelRenderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
} // 创建地板
const createFloor = () => {
  const floorGroup = new THREE.Group()

  // 创建主地板
  const geometry = new THREE.PlaneGeometry(
    warehouseConfig.width,
    warehouseConfig.length,
    50,
    50
  )

  // 创建地板材质
  const floorTexture = new THREE.TextureLoader().load(
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/floors/FloorsCheckerboard_S_Diffuse.jpg'
  )
  floorTexture.wrapS = THREE.RepeatWrapping
  floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(8, 12)

  // 添加地面导航线
  const addFloorGuides = () => {
    const pathMaterial = new THREE.LineDashedMaterial({
      color: 0x00ff00,
      linewidth: 2,
      dashSize: 3,
      gapSize: 1
    })

    // 添加通道线
    for (let row = 0; row < warehouseConfig.shelfRows + 1; row++) {
      const z = -warehouseConfig.length / 2 + 10 + row * 15
      const geometry = new THREE.BufferGeometry()
      const points = [
        new THREE.Vector3(-warehouseConfig.width / 2 + 5, 0.05, z),
        new THREE.Vector3(warehouseConfig.width / 2 - 5, 0.05, z)
      ]
      geometry.setFromPoints(points)
      const line = new THREE.Line(geometry, pathMaterial)
      line.computeLineDistances()
      floorGroup.add(line)
    }
  }
  const material = new THREE.MeshStandardMaterial({
    map: floorTexture,
    color: 0x000000,
    roughness: 0.8,
    metalness: 0.2
  })

  const floor = new THREE.Mesh(geometry, material)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  floorGroup.add(floor)

  // 添加区域标记
  const addZoneMarkers = () => {
    const zones = ['A区', 'B区', 'C区', 'D区', 'E区']
    zones.forEach((zone, index) => {
      const labelDiv = document.createElement('div')
      labelDiv.className = 'zone-label'
      labelDiv.textContent = zone
      labelDiv.style.color = 'white'
      labelDiv.style.background = 'rgba(0, 102, 255, 0.8)'
      labelDiv.style.padding = '4px 8px'
      labelDiv.style.borderRadius = '4px'
      const label = new CSS2DObject(labelDiv)
      label.position.set(
        -warehouseConfig.width / 2 + 10,
        0.2,
        -warehouseConfig.length / 2 + 20 + index * 15
      )
      floorGroup.add(label)
    })
  }

  // 添加基础网格线
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x999999 })
  const lineGeometry = new THREE.BufferGeometry()
  const linePoints = []

  // 横向线
  for (
    let i = -warehouseConfig.length / 2;
    i <= warehouseConfig.length / 2;
    i += 10
  ) {
    linePoints.push(
      -warehouseConfig.width / 2,
      0.01,
      i,
      warehouseConfig.width / 2,
      0.01,
      i
    )
  }

  // 纵向线
  for (
    let i = -warehouseConfig.width / 2;
    i <= warehouseConfig.width / 2;
    i += 10
  ) {
    linePoints.push(
      i,
      0.01,
      -warehouseConfig.length / 2,
      i,
      0.01,
      warehouseConfig.length / 2
    )
  }
  lineGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(linePoints, 3)
  )
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
  floorGroup.add(lines)

  // 添加导航线和区域标记
  addFloorGuides()
  addZoneMarkers()

  warehouse.add(floorGroup)
}

// 创建墙壁
const createWalls = () => {
  // 加载墙面纹理
  const textureLoader = new THREE.TextureLoader()
  const wallTexture = textureLoader.load(
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/brick_diffuse.jpg'
  )
  wallTexture.wrapS = THREE.RepeatWrapping
  wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(6, 2)

  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    color: 0xe8e8e8,
    roughness: 0.7,
    metalness: 0.1,
    bumpMap: wallTexture,
    bumpScale: 0.1
  })

  // 后墙
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(
      warehouseConfig.width,
      warehouseConfig.height,
      20,
      20
    ),
    wallMaterial
  )
  backWall.position.z = -warehouseConfig.length / 2
  backWall.position.y = warehouseConfig.height / 2
  backWall.receiveShadow = true

  // 侧墙
  const sideWall = new THREE.Mesh(
    new THREE.PlaneGeometry(
      warehouseConfig.length,
      warehouseConfig.height,
      20,
      20
    ),
    wallMaterial
  )
  sideWall.rotation.y = Math.PI / 2
  sideWall.position.x = -warehouseConfig.width / 2
  sideWall.position.y = warehouseConfig.height / 2
  sideWall.receiveShadow = true

  // 添加装饰线条
  const trimGeometry = new THREE.BoxGeometry(2, warehouseConfig.height, 2)
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.5,
    roughness: 0.4
  })

  // 后墙装饰柱
  for (
    let x = -warehouseConfig.width / 2;
    x <= warehouseConfig.width / 2;
    x += warehouseConfig.width / 4
  ) {
    const trim = new THREE.Mesh(trimGeometry, trimMaterial)
    trim.position.set(
      x,
      warehouseConfig.height / 2,
      -warehouseConfig.length / 2 + 1
    )
    warehouse.add(trim)
  }

  // 侧墙装饰柱
  for (
    let z = -warehouseConfig.length / 2;
    z <= warehouseConfig.length / 2;
    z += warehouseConfig.length / 6
  ) {
    const trim = new THREE.Mesh(trimGeometry, trimMaterial)
    trim.position.set(
      -warehouseConfig.width / 2 + 1,
      warehouseConfig.height / 2,
      z
    )
    warehouse.add(trim)
  }

  // 添加顶部装饰线
  const topTrimGeometry = new THREE.BoxGeometry(warehouseConfig.width, 2, 2)
  const backTopTrim = new THREE.Mesh(topTrimGeometry, trimMaterial)
  backTopTrim.position.set(
    0,
    warehouseConfig.height,
    -warehouseConfig.length / 2 + 1
  )

  const sideTrimGeometry = new THREE.BoxGeometry(2, 2, warehouseConfig.length)
  const sideTopTrim = new THREE.Mesh(sideTrimGeometry, trimMaterial)
  sideTopTrim.position.set(
    -warehouseConfig.width / 2 + 1,
    warehouseConfig.height,
    0
  )

  warehouse.add(backWall, sideWall, backTopTrim, sideTopTrim)

  // 添加警示标识
  const warningSignGeometry = new THREE.PlaneGeometry(10, 5)
  const warningSignMaterial = new THREE.MeshBasicMaterial({
    color: 0xff9900,
    side: THREE.DoubleSide
  })

  const createWarningSign = (position, rotation) => {
    const sign = new THREE.Mesh(warningSignGeometry, warningSignMaterial)
    sign.position.copy(position)
    sign.rotation.copy(rotation)
    warehouse.add(sign)
  }

  // 添加几个警示标识
  createWarningSign(
    new THREE.Vector3(
      0,
      warehouseConfig.height / 2,
      -warehouseConfig.length / 2 + 0.1
    ),
    new THREE.Euler(0, 0, 0)
  )
  createWarningSign(
    new THREE.Vector3(
      -warehouseConfig.width / 2 + 0.1,
      warehouseConfig.height / 2,
      0
    ),
    new THREE.Euler(0, Math.PI / 2, 0)
  )
}

// 创建单个货架
const createShelf = (position, id) => {
  const shelf = new THREE.Group()
  const { shelfWidth, shelfHeight, shelfDepth } = warehouseConfig

  // 创建金属材质
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x8c8c8c,
    metalness: 0.8,
    roughness: 0.3,
    envMapIntensity: 1
  })

  // 创建支柱材质（略深色）
  const pillarMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.9,
    roughness: 0.2
  })

  // 创建四个支柱
  const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, shelfHeight, 8)
  const pillarPositions = [
    [-shelfWidth / 2 + 0.2, 0, -shelfDepth / 2 + 0.2],
    [shelfWidth / 2 - 0.2, 0, -shelfDepth / 2 + 0.2],
    [-shelfWidth / 2 + 0.2, 0, shelfDepth / 2 - 0.2],
    [shelfWidth / 2 - 0.2, 0, shelfDepth / 2 - 0.2]
  ]

  pillarPositions.forEach((pos) => {
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
    pillar.position.set(pos[0], 0, pos[2])
    pillar.castShadow = true
    shelf.add(pillar)
  })

  // 添加横梁
  const beamGeometry = new THREE.BoxGeometry(0.15, 0.15, shelfDepth)
  const levelHeight = shelfHeight / 4

  // 前后横梁
  for (let i = 0; i <= 4; i++) {
    const y = -shelfHeight / 2 + i * levelHeight
    ;[-shelfWidth / 2 + 0.2, shelfWidth / 2 - 0.2].forEach((x) => {
      const beam = new THREE.Mesh(beamGeometry, metalMaterial)
      beam.position.set(x, y, 0)
      beam.castShadow = true
      shelf.add(beam)
    })
  }

  // 层板
  for (let i = 1; i < 4; i++) {
    // 主层板
    const level = new THREE.Mesh(
      new THREE.BoxGeometry(shelfWidth - 0.4, 0.1, shelfDepth - 0.4),
      metalMaterial
    )
    level.position.y = -shelfHeight / 2 + i * levelHeight
    level.castShadow = true
    level.receiveShadow = true

    // 层板装饰条纹
    const stripeCount = 5
    const stripeWidth = (shelfDepth - 0.6) / stripeCount
    for (let j = 0; j < stripeCount; j++) {
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(shelfWidth - 0.6, 0.12, 0.05),
        metalMaterial
      )
      stripe.position.set(
        0,
        -shelfHeight / 2 + i * levelHeight,
        -shelfDepth / 2 + 0.4 + j * stripeWidth
      )
      stripe.castShadow = true
      shelf.add(stripe)
    }

    shelf.add(level)
  }

  // 添加标签
  const labelDiv = document.createElement('div')
  labelDiv.className = 'shelf-label'
  labelDiv.textContent = `货架 ${id}`
  const label = new CSS2DObject(labelDiv)
  label.position.set(0, shelfHeight / 2 + 1, 0)
  shelf.add(label)

  // 添加安全提示标签
  const capacityLabel = document.createElement('div')
  capacityLabel.className = 'shelf-capacity'
  //   capacityLabel.textContent = '最大承重: 500kg'
  //   capacityLabel.style.fontSize = '10px'
  //   capacityLabel.style.color = '#ff9900'
  const capacityObj = new CSS2DObject(capacityLabel)
  capacityObj.position.set(0, -shelfHeight / 2 + 0.5, shelfDepth / 2)
  shelf.add(capacityObj)

  // 设置位置
  shelf.position.copy(position)

  // 存储货架信息
  shelves.set(id, {
    mesh: shelf,
    products: [],
    capacity: 12, // 每个货架可存储的商品数量
    id
  })

  return shelf
}

// 创建所有货架
const createShelves = () => {
  const { shelfRows, shelvesPerRow, shelfWidth, length, width } =
    warehouseConfig
  const startX = -width / 2 + shelfWidth
  const startZ = -length / 2 + 10

  for (let row = 0; row < shelfRows; row++) {
    for (let col = 0; col < shelvesPerRow; col++) {
      const id = `${String.fromCharCode(65 + row)}${col + 1}`
      const x = startX + col * (shelfWidth + 5)
      const z = startZ + row * 15
      const shelf = createShelf(new THREE.Vector3(x, 0, z), id)
      warehouse.add(shelf)
    }
  }
}

// 添加随机商品到货架
const addRandomProducts = () => {
  const products = [
    { name: '电子产品', color: 0x4287f5 },
    { name: '食品', color: 0xf54242 },
    { name: '服装', color: 0x42f554 },
    { name: '图书', color: 0xf5c242 }
  ]

  shelves.forEach((shelfInfo) => {
    const numProducts = Math.floor(Math.random() * 8) + 1 // 1-8个商品
    for (let i = 0; i < numProducts; i++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const productMesh = createProduct(product)
      const level = Math.floor(i / 3)
      const offset = (i % 3) - 1

      productMesh.position.set(
        offset * 2,
        -warehouseConfig.shelfHeight / 2 +
          (level + 1) * (warehouseConfig.shelfHeight / 4),
        0
      )

      shelfInfo.mesh.add(productMesh)
      shelfInfo.products.push({
        name: product.name,
        position: new THREE.Vector3().copy(productMesh.position),
        mesh: productMesh
      })
    }
  })
}

// 创建商品
const createProduct = (product) => {
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const material = new THREE.MeshStandardMaterial({
    color: product.color,
    roughness: 0.3,
    metalness: 0.2
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.userData.product = product
  return mesh
}

// 处理货架点击
const handleShelfClick = (event) => {
  const mouse = new THREE.Vector2()
  const rect = event.target.getBoundingClientRect()

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children, true)

  if (intersects.length > 0) {
    let shelf = null
    let selectedObject = intersects[0].object

    // 查找被点击对象所属的货架
    shelves.forEach((shelfInfo) => {
      if (
        shelfInfo.mesh.children.includes(selectedObject) ||
        shelfInfo.mesh === selectedObject
      ) {
        shelf = shelfInfo
      }
    })

    if (shelf) {
      selectedShelfInfo.value = shelf
      focusOnShelf(shelf)
    }
  }
}

// 聚焦到选中的货架
const focusOnShelf = (shelf) => {
  const position = shelf.mesh.position.clone()
  position.y += warehouseConfig.shelfHeight
  position.z += 10

  gsap.to(camera.position, {
    duration: 1,
    x: position.x,
    y: position.y,
    z: position.z,
    onUpdate: () => {
      camera.lookAt(shelf.mesh.position)
    }
  })
}

// 动画循环
const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
}

// 处理窗口大小变化
const handleResize = () => {
  if (!containerRef.value) return

  camera.aspect =
    containerRef.value.clientWidth / containerRef.value.clientHeight
  camera.updateProjectionMatrix()

  renderer.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight
  )
  labelRenderer.setSize(
    containerRef.value.clientWidth,
    containerRef.value.clientHeight
  )
}

// 初始化场景  // 创建消防设备
const createFireExtinguisher = (position) => {
  const extinguisher = new THREE.Group()

  // 主体
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 2, 16),
    new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 0.7,
      roughness: 0.3
    })
  )

  // 喷嘴
  const nozzle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8),
    body.material
  )
  nozzle.position.y = 1.2
  nozzle.rotation.z = Math.PI / 4

  extinguisher.add(body, nozzle)
  extinguisher.position.copy(position)
  return extinguisher
}

// 创建安全标识
const createSafetySign = (position, text) => {
  const signGroup = new THREE.Group()

  // 标志牌
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 2),
    new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide
    })
  )

  const labelDiv = document.createElement('div')
  labelDiv.className = 'safety-label'
  labelDiv.textContent = text
  labelDiv.style.color = 'white'
  labelDiv.style.background = 'rgba(0, 128, 0, 0.8)'
  labelDiv.style.padding = '4px 8px'
  labelDiv.style.borderRadius = '4px'
  const label = new CSS2DObject(labelDiv)
  label.position.y = 0.2

  signGroup.add(sign, label)
  signGroup.position.copy(position)
  return signGroup
}

const init = async () => {
  initScene()
  createFloor()
  createWalls()
  createShelves()
  addRandomProducts()

  // 添加安全设备
  const safetyEquipment = new THREE.Group()

  // 添加灭火器
  const extinguisherPositions = [
    new THREE.Vector3(
      -warehouseConfig.width / 2 + 2,
      5,
      -warehouseConfig.length / 2 + 10
    ),
    new THREE.Vector3(-warehouseConfig.width / 2 + 2, 5, 0),
    new THREE.Vector3(
      -warehouseConfig.width / 2 + 2,
      5,
      warehouseConfig.length / 2 - 10
    )
  ]
  extinguisherPositions.forEach((pos) => {
    safetyEquipment.add(createFireExtinguisher(pos))
  })

  // 添加安全标识
  safetyEquipment.add(
    createSafetySign(
      new THREE.Vector3(
        -warehouseConfig.width / 2 + 0.2,
        warehouseConfig.height - 5,
        0
      ),
      '紧急出口'
    )
  )

  warehouse.add(safetyEquipment)
  scene.add(warehouse)
  animate()
  isLoading.value = false
}

// 重置视角
const resetView = () => {
  gsap.to(camera.position, {
    duration: 1,
    x: 100,
    y: 100,
    z: 100,
    onUpdate: () => {
      camera.lookAt(0, 0, 0)
    }
  })
}

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (renderer) {
    renderer.dispose()
  }
  if (controls) {
    controls.dispose()
  }
})
</script>

<template>
  <div class="warehouse-container">
    <div class="controls">
      <el-button @click="resetView">重置视角</el-button>
    </div>

    <!-- 加载状态 -->
    <div
      v-if="isLoading"
      class="loading"
    >
      <el-icon class="loading-icon">
        <Loading />
      </el-icon>
      加载中...
    </div>

    <!-- 3D场景容器 -->
    <div
      ref="containerRef"
      class="scene-container"
      @click="handleShelfClick"
    ></div>

    <!-- 货架信息面板 -->
    <div
      v-if="selectedShelfInfo"
      class="shelf-info"
    >
      <h3>货架信息 {{ selectedShelfInfo.id }}</h3>
      <div class="info-content">
        <div>商品数量: {{ selectedShelfInfo.products.length }}</div>
        <div>剩余容量: {{ selectedShelfInfo.capacity - selectedShelfInfo.products.length }}</div>
        <div class="products-list">
          <h4>商品列表:</h4>
          <ul>
            <li
              v-for="(product, index) in selectedShelfInfo.products"
              :key="index"
            >
              {{ product.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.warehouse-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}

.scene-container {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  color: #409eff;
}

.loading-icon {
  font-size: 24px;
  animation: rotate 1s linear infinite;
}

.shelf-info {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 300px;
  z-index: 10;
}

.shelf-info h3 {
  margin: 0 0 10px 0;
  color: #303133;
}

.info-content {
  font-size: 14px;
}

.products-list {
  margin-top: 10px;
}

.products-list h4 {
  margin: 0 0 5px 0;
  color: #606266;
}

.products-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.products-list li {
  padding: 3px 0;
  color: #606266;
}

:global(.shelf-label) {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>