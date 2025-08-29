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
    this.speed = 8
    this.acceleration = 1.025
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
    this.speed = Math.random() * 8 + 1
    this.friction = 0.95
    this.gravity = 0.98
    this.brightness = Math.random() * 50 + 50
    this.alpha = 1
    this.decay = Math.random() * 0.03 + 0.02
    this.pink = `hsla(350, 100%, ${this.brightness}%, ${this.alpha})`
  }

  update() {
    this.speed *= this.friction
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed + this.gravity
    this.alpha -= this.decay
    this.pink = `hsla(350, 100%, ${this.brightness}%, ${this.alpha})`
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = this.pink
    ctx.fill()
  }
}

// 创建爆炸粒子
function createParticles(x, y) {
  const particleCount = 50
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(x, y))
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
  ctx.fillStyle = 'rgba(11, 19, 43, 0.2)'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

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
