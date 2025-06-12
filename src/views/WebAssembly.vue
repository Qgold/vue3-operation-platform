<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { loadWasm } from '../wasm-loader.js'
import { onMounted } from 'vue'
let scene, camera, renderer, controls
let wasmModule
let isWireframe = false
let selectedShelf = null
let cargoMeshes = new Map() // 存储货物的3D模型
let composer
async function init() {
  // 初始化场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb) // 天空蓝背景
  scene.fog = new THREE.FogExp2(0x87ceeb, 0.002) // 添加雾效

  // 设置相机
  camera = new THREE.PerspectiveCamera(
    75,
    (window.innerWidth - 200) / (window.innerHeight - 200),
    0.1,
    1000
  )
  camera.position.set(200, 100, 100)

  // 设置渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance' // 高性能模式
  })
  renderer.shadowMap.enabled = true // 启用阴影
  renderer.shadowMap.type = THREE.PCFSoftShadowMap // 柔和阴影

  renderer.setSize(window.innerWidth - 300, window.innerHeight - 180)
  renderer.setPixelRatio(window.devicePixelRatio)
  document.querySelector('.intro-container').appendChild(renderer.domElement)

  renderer.domElement.addEventListener('click', onMouseClick, false)
  // 添加轨道控制
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // 添加环境光和平行光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(1, 2, 1)
  directionalLight.castShadow = true // 启用阴影
  directionalLight.shadow.mapSize.width = 2048 // 阴影质量
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  // 添加半球光
  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5)
  scene.add(hemisphereLight)

  // 加载WebAssembly模块
  wasmModule = await loadWasm()
  createWarehouse()

  // 添加地板网格
  addFloorGrid()

  //   // 后期处理
  //   const renderScene = new RenderPass(scene, camera);
  //   const bloomPass = new UnrealBloomPass(
  //     new THREE.Vector2(window.innerWidth, window.innerHeight),
  //     1.5,
  //     0.4,
  //     0.85
  //   );
  //   bloomPass.threshold = 0;
  //   bloomPass.strength = 1.5;
  //   bloomPass.radius = 0.5;

  //   composer = new EffectComposer(renderer);
  //   composer.addPass(renderScene);
  //   composer.addPass(bloomPass);

  // 添加事件监听
  window.addEventListener('resize', onWindowResize, false)
  document
    .getElementById('toggleWireframe')
    .addEventListener('click', toggleWireframe)
  document.getElementById('resetCamera').addEventListener('click', resetCamera)

  // 添加货物相关的UI控件
  setupUI()

  // 开始动画循环
  animate()
}

function setupUI() {
  const controls = document.getElementById('controls')

  // 添加货架选择
  const shelfSelect = document.getElementById('shelfSelect')
  shelfSelect.innerHTML = '<option value="">选择货架...</option>'
  const shelfCount = wasmModule.getShelfCount()
  for (let i = 0; i < shelfCount; i++) {
    shelfSelect.innerHTML += `<option value="${i}">货架 ${i + 1}</option>`
  }
  shelfSelect.addEventListener('change', (e) => {
    selectedShelf = e.target.value !== '' ? parseInt(e.target.value) : null
  })

  // 添加货物表单
  const cargoForm = document.createElement('div')
  cargoForm.innerHTML = `
        <input type="text" id="cargoId" placeholder="货物ID" />
        <input type="number" id="cargoWidth" placeholder="宽度" step="0.1" />
        <input type="number" id="cargoHeight" placeholder="高度" step="0.1" />
        <input type="number" id="cargoDepth" placeholder="深度" step="0.1" />
        <input type="number" id="cargoWeight" placeholder="重量" step="0.1" />
        <button id="addCargo">添加货物</button>
        <button id="removeCargo">移除货物</button>
    `

  controls.appendChild(document.createElement('br'))
  controls.appendChild(shelfSelect)
  controls.appendChild(cargoForm)

  // 添加事件监听
  document.getElementById('addCargo').addEventListener('click', addCargoFromUI)
  document
    .getElementById('removeCargo')
    .addEventListener('click', removeCargoFromUI)

  const backButton = document.createElement('button')
  backButton.id = 'backButton'
  backButton.textContent = '返回全景视图'
  backButton.addEventListener('click', resetToDefaultView)
  controls.appendChild(backButton)
}

function resetToDefaultView() {
  animateCameraToPosition(
    new THREE.Vector3(100, 100, 100),
    new THREE.Vector3(0, 0, 0)
  )
}

function animateCameraToPosition(targetPos, lookAtPos) {
  // 类似animateCameraToShelf的实现
  // ...
  animateCameraToShelf(targetPos, lookAtPos, 1000) // 1000ms是动画持续时间
}
function addCargoFromUI() {
  if (selectedShelf === null) {
    alert('请先选择货架！')
    return
  }

  const idStr = document.getElementById('cargoId').value
  const id = parseInt(idStr)
  if (isNaN(id)) {
    alert('货物ID必须是数字！')
    return
  }

  const width = parseFloat(document.getElementById('cargoWidth').value)
  const height = parseFloat(document.getElementById('cargoHeight').value)
  const depth = parseFloat(document.getElementById('cargoDepth').value)
  const weight = parseFloat(document.getElementById('cargoWeight').value)

  if (isNaN(width) || isNaN(height) || isNaN(depth) || isNaN(weight)) {
    alert('请填写所有字段！')
    return
  }

  const shelfX = wasmModule.getShelfProperty(selectedShelf, 'x')
  const shelfY = wasmModule.getShelfProperty(selectedShelf, 'y')
  const shelfZ = wasmModule.getShelfProperty(selectedShelf, 'z')

  const x = shelfX + 1 // 放在货架边缘
  const y = shelfY + 1
  const z = shelfZ + 1

  if (
    wasmModule.addCargo(
      selectedShelf,
      id,
      x,
      y,
      z,
      width,
      height,
      depth,
      weight
    )
  ) {
    addCargoMesh(id, x, y, z, width, height, depth)
    alert('货物添加成功！')
  } else {
    alert('无法放置货物，请检查尺寸和重量限制！')
  }
}

function removeCargoFromUI() {
  const idStr = document.getElementById('cargoId').value
  const id = parseInt(idStr)
  if (isNaN(id)) {
    alert('货物ID必须是数字！')
    return
  }

  // 遍历所有货架查找货物
  const shelfCount = wasmModule.getShelfCount()
  for (let i = 0; i < shelfCount; i++) {
    if (wasmModule.removeCargo(i, id)) {
      removeCargoMesh(id)
      alert('货物移除成功！')
      return
    }
  }
  alert('未找到指定货物！')
}

function addCargoMesh(id, x, y, z, width, height, depth) {
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const material = new THREE.MeshStandardMaterial({
    color: 0x4caf50,
    metalness: 0.1,
    roughness: 0.5,
    transparent: true,
    opacity: 0.9
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x + width / 2, y + height / 2, z + depth / 2)
  scene.add(mesh)
  cargoMeshes.set(id, mesh)
}

function removeCargoMesh(cargoId) {
  const mesh = cargoMeshes.get(cargoId)
  if (mesh) {
    scene.remove(mesh)
    cargoMeshes.delete(cargoId)
  }
}

function createWarehouse() {
  // 创建仓库外壳
  const width = wasmModule.getWarehouseWidth()
  const height = wasmModule.getWarehouseHeight()
  const depth = wasmModule.getWarehouseDepth()

  const warehouseGeometry = new THREE.BoxGeometry(width, height, depth)
  const warehouseMaterial = new THREE.MeshPhongMaterial({
    color: 0x969696,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  })
  const warehouseMesh = new THREE.Mesh(warehouseGeometry, warehouseMaterial)
  scene.add(warehouseMesh)
  // 添加示例货架
  addShelf(0, 0, 0, 20, 30, 20, 1000)
  addShelf(30, 0, 0, 20, 30, 20, 1000)
  addShelf(0, 0, 30, 20, 30, 20, 1000)
  addShelf(0, 0, -30, 20, 30, 20, 1000)
  addShelf(-30, 0, -30, 20, 30, 20, 1000)
}

function addShelf(x, y, z, width, height, depth, maxWeight) {
  const shelfGeometry = new THREE.BoxGeometry(width, height, depth)
  const shelfMaterial = new THREE.MeshStandardMaterial({
    color: 0xe44444,
    metalness: 0.3,
    roughness: 0.7
  })
  const shelfMesh = new THREE.Mesh(shelfGeometry, shelfMaterial)
  shelfMesh.position.set(x + width / 2, y + height / 2, z + depth / 2)

  shelfMesh.userData = { isShelf: true }
  scene.add(shelfMesh)

  // 在WebAssembly中添加货架
  wasmModule.addShelf(x, y, z, width, height, depth, maxWeight)
}

function addFloorGrid() {
  // 移除原来的网格
  // const gridHelper = new THREE.GridHelper(200, 20);
  // scene.add(gridHelper);

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // 绘制草地基础色
  ctx.fillStyle = '#4a7023'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 添加草地细节
  ctx.fillStyle = '#5a8033'
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const size = Math.random() * 3 + 1
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  // 创建地面平面
  const groundGeometry = new THREE.PlaneGeometry(200, 200)
  // 创建纹理
  const groundTexture = new THREE.CanvasTexture(canvas)
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
  groundTexture.repeat.set(10, 10)
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: groundTexture,
    color: 0x4a7023,
    roughness: 0.8,
    metalness: 0.2
  })

  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2 // 旋转平面使其水平
  ground.receiveShadow = true // 接收阴影
  scene.add(ground)
}

function toggleWireframe() {
  isWireframe = !isWireframe
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.material.wireframe = isWireframe
    }
  })
}

function resetCamera() {
  camera.position.set(100, 100, 100)
  camera.lookAt(0, 0, 0)
  controls.reset()
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
  //   composer.render();
}

// 监听鼠标移动事件
// document.addEventListener("mousemove", (event) => {
//   // 根据鼠标位置更新相机视角
//   camera.position.x = event.clientX * 0.01;
//   camera.position.y = -(event.clientY * 0.01);
//   camera.lookAt(scene.position);
// });
function onMouseClick(event) {
  // 将鼠标坐标转换为Three.js坐标
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  )

  // 创建射线投射器
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)

  // 检测与货架的相交
  const intersects = raycaster.intersectObjects(scene.children)

  for (let i = 0; i < intersects.length; i++) {
    const object = intersects[i].object

    // 检查是否是货架
    if (object.userData.isShelf) {
      // 获取货架位置和尺寸
      const shelfPos = object.position
      const shelfSize = object.geometry.parameters

      // 计算相机目标位置(货架内部中心)
      const targetPos = new THREE.Vector3(
        shelfPos.x,
        shelfPos.y + shelfSize.height * 0.5,
        shelfPos.z
      )

      // 动画移动到货架内部
      animateCameraToShelf(targetPos)
      break
    }
  }
}

// 相机动画函数
function animateCameraToShelf(targetPos, lookAtPos = null, duration = 1000) {
  // 禁用轨道控制
  controls.enabled = false

  // 计算相机位置(稍微后退一点)
  const cameraPos = new THREE.Vector3().copy(targetPos)
  cameraPos.z += 20 // 调整这个值改变相机距离

  // 创建动画

  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 平滑插值
    const smoothProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

    // 移动相机
    camera.position.lerpVectors(camera.position, cameraPos, smoothProgress)
    camera.lookAt(lookAtPos || targetPos)

    // 更新控制器
    controls.target.copy(lookAtPos || targetPos)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // 动画完成后重新启用控制
      controls.enabled = true
    }
  }

  animate()
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="intro-container">
    <div id="loading">加载中...</div>
    <div id="controls">
      <div class="button-group">
        <button id="toggleWireframe">切换线框模式</button>
        <button id="resetCamera">重置视角</button>
      </div>
      <select id="shelfSelect">
        <option value="">选择货架...</option>
      </select>
      <div id="cargoForm">
        <div class="form-group">
          <label for="cargoId">货物ID</label>
          <input
            type="text"
            id="cargoId"
            placeholder="输入货物ID"
          />
        </div>
        <div class="form-group">
          <label for="cargoWeight">重量 (kg)</label>
          <input
            type="number"
            id="cargoWeight"
            placeholder="重量"
            step="0.1"
            min="0"
          />
        </div>
        <div class="form-group">
          <label for="cargoWidth">宽度 (m)</label>
          <input
            type="number"
            id="cargoWidth"
            placeholder="宽度"
            step="0.1"
            min="0"
          />
        </div>
        <div class="form-group">
          <label for="cargoHeight">高度 (m)</label>
          <input
            type="number"
            id="cargoHeight"
            placeholder="高度"
            step="0.1"
            min="0"
          />
        </div>
        <div class="form-group">
          <label for="cargoDepth">深度 (m)</label>
          <input
            type="number"
            id="cargoDepth"
            placeholder="深度"
            step="0.1"
            min="0"
          />
        </div>
        <div class="button-group">
          <button id="addCargo">添加货物</button>
          <button
            id="removeCargo"
            style="background: #f44336;"
          >移除货物</button>
        </div>
      </div>

    </div>
  </div>

</template>
<style scoped>
canvas {
  display: block;
}
#controls {
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}
button:hover {
  background: #45a049;
}
select,
input {
  margin: 5px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}
#cargoForm {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}
.button-group {
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
#loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 8px;
  display: none;
}
</style>