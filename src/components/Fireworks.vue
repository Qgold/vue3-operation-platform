<template>
  <div class="fireworks-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx = null
let animationFrame = null
let fireworks = []
let particles = []

// 烟花类
class Firework {
  constructor(startX, startY, targetX, targetY) {
    this.x = startX
    this.y = startY
    this.startX = startX
    this.startY = startY
    this.targetX = targetX
    this.targetY = targetY

    // 计算距离
    this.distanceToTarget = Math.sqrt(
      Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2)
    )
    this.distanceTraveled = 0

    // 轨迹计算
    this.angle = Math.atan2(targetY - startY, targetX - startX)
    this.speed = 5  // 降低发射初始速度
    this.acceleration = 1.015  // 降低加速度
    this.brightness = 70
    this.targetRadius = 1
    this.trail = []
    this.trailLength = 5
    this.pink = `hsla(350, 100%, ${this.brightness}%, 1)`
  }

  update() {
    this.trail.push([this.x, this.y])
    if (this.trail.length > this.trailLength) {
      this.trail.shift()
    }

    this.speed *= this.acceleration

    const xVelocity = Math.cos(this.angle) * this.speed
    const yVelocity = Math.sin(this.angle) * this.speed

    this.distanceTraveled = Math.sqrt(
      Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2)
    )

    if (this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.targetX, this.targetY)
      fireworks = fireworks.filter((fw) => fw !== this)
    } else {
      this.x += xVelocity
      this.y += yVelocity
    }
  }

  draw() {
    ctx.beginPath()
    const trailEndIndex = this.trail.length - 1
    ctx.moveTo(this.trail[trailEndIndex][0], this.trail[trailEndIndex][1])
    for (let i = trailEndIndex; i > 0; i--) {
      const point = this.trail[i - 1]
      ctx.lineTo(point[0], point[1])
    }
    ctx.strokeStyle = this.pink
    ctx.stroke()
  }
}

// 粒子类
class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.angle = Math.random() * Math.PI * 2
    this.speed = Math.random() * 8 + 2 // 降低粒子初始速度
    this.friction = 0.97 // 增加摩擦力，让粒子减速更快
    this.gravity = 0.35 // 减小重力，让粒子下落更慢
    this.size = Math.random() * 3 + 2
    this.brightness = Math.random() * 60 + 40
    this.alpha = 1
    this.decay = Math.random() * 0.015 + 0.008 // 降低衰减速度，让粒子存在更久
    this.color = Math.random() < 0.3 ? 'white' : 'pink' // 30%概率为白色，增加层次感
    this.pink =
      this.color === 'pink'
        ? `hsla(350, 100%, ${this.brightness}%, ${this.alpha})`
        : `hsla(0, 0%, 100%, ${this.alpha})`
  }

  update() {
    this.speed *= this.friction
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed + this.gravity
    this.alpha -= this.decay
    this.size *= 0.99 // 粒子大小逐渐减小
    this.pink =
      this.color === 'pink'
        ? `hsla(350, 100%, ${this.brightness}%, ${this.alpha})`
        : `hsla(0, 0%, 100%, ${this.alpha})`
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.pink
    ctx.shadowBlur = 15
    ctx.shadowColor = this.pink
    ctx.fill()
    ctx.shadowBlur = 0 // 重置阴影，避免影响其他绘制
  }
}

// 创建爆炸粒子
function createParticles(x, y) {
  const particleCount = 120 // 增加粒子数量
  const colors = ['350', '335', '360'] // 不同的粉色色调

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(x, y))

    // 创建次级爆炸效果
    if (Math.random() < 0.2) {
      // 20%概率产生次级爆炸
      setTimeout(() => {
        const subParticles = 8
        const radius = Math.random() * 30 + 20
        for (let j = 0; j < subParticles; j++) {
          const angle = (j / subParticles) * Math.PI * 2
          const subX = x + Math.cos(angle) * radius
          const subY = y + Math.sin(angle) * radius
          particles.push(new Particle(subX, subY))
        }
      }, Math.random() * 300 + 200) // 200-500ms后产生次级爆炸
    }
  }
}

// 发射新烟花
function launchFirework() {
  const startX = Math.random() * canvas.value.width
  const startY = canvas.value.height
  const targetX = Math.random() * canvas.value.width
  const targetY = Math.random() * (canvas.value.height * 0.6)

  fireworks.push(new Firework(startX, startY, targetX, targetY))
}

// 动画循环
function animate() {
  ctx.fillStyle = 'rgba(11, 19, 43, 0.15)' // 减小透明度，让拖尾效果更明显
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

  // 添加模糊效果，让整体更柔和
  //   ctx.globalCompositeOperation = 'lighter'

  // 更新和绘制烟花
  fireworks.forEach((firework) => {
    firework.update()
    firework.draw()
  })

  // 更新和绘制粒子
  particles = particles.filter((particle) => particle.alpha > 0)
  particles.forEach((particle) => {
    particle.update()
    particle.draw()
  })

  // 随机发射新烟花
  if (Math.random() < 0.05 && fireworks.length < 4) {
    launchFirework()
  }

  animationFrame = requestAnimationFrame(animate)
}

// 初始化画布
function initCanvas() {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  ctx = canvas.value.getContext('2d')
  ctx.fillStyle = '#0B132B'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
}

// 监听窗口大小变化
function handleResize() {
  initCanvas()
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animationFrame)
})
</script>

<style scoped>
.fireworks-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0b132b;
  z-index: 1000;
}

canvas {
  display: block;
}
</style>
