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

    // 计算基础角度（主要是向上）
    this.baseAngle = Math.PI * 1.5 // 默认向上

    // 添加轻微的随机偏移，使其不会完全垂直
    const angleVariation = (Math.random() - 0.5) * 0.2
    this.angle = this.baseAngle + angleVariation

    // 更自然的速度设置
    this.speed = 2 // 非常慢的初始速度
    this.acceleration = 1.03 // 更缓和的加速度
    this.maxSpeed = 6 // 限制最大速度

    // 摇摆效果
    this.wobble = 0
    this.wobbleSpeed = (Math.random() - 0.5) * 0.03 // 轻微的摇摆速度

    // 轨迹样式
    this.trail = []
    this.trailLength = 5 // 稍长的尾迹
    this.hue = 45 // 金色尾迹
    this.brightness = 60
    this.alpha = 1

    // 火花效果
    this.sparkSize = 1
    this.sparkFreq = 0.05 // 火花出现频率
    this.sparks = []
  }

  update() {
    // 更新轨迹
    this.trail.push([this.x, this.y])
    if (this.trail.length > this.trailLength) {
      this.trail.shift()
    }

    // 速度控制
    if (this.speed < this.maxSpeed) {
      this.speed *= this.acceleration
    }

    // 更新摇摆效果
    this.wobble += this.wobbleSpeed
    const wobbleX = Math.sin(this.wobble) * 1.5

    // 计算运动
    const yVelocity = -this.speed // 向上的速度（负值表示向上）
    this.y += yVelocity
    this.x += wobbleX // 添加轻微的左右摇摆

    // 检查是否到达目标高度
    if (this.y <= this.targetY) {
      createParticles(this.x, this.y)
      fireworks = fireworks.filter((fw) => fw !== this)
    }

    // 火花效果
    if (Math.random() < this.sparkFreq) {
      this.sparks.push({
        x: this.x,
        y: this.y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 1,
        life: 1
      })
    }

    // 更新火花
    this.sparks.forEach((spark, i) => {
      spark.x += spark.vx
      spark.y += spark.vy
      spark.life *= 0.95
      if (spark.life <= 0.01) {
        this.sparks.splice(i, 1)
      }
    })
  }

  draw() {
    // 绘制主轨迹
    if (this.trail.length > 1) {
      ctx.beginPath()
      const gradient = ctx.createLinearGradient(
        this.trail[0][0],
        this.trail[0][1],
        this.x,
        this.y
      )
      gradient.addColorStop(
        0,
        `hsla(${this.hue}, 100%, ${this.brightness}%, 0)`
      )
      gradient.addColorStop(
        1,
        `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`
      )

      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.shadowBlur = 6
      ctx.shadowColor = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`

      ctx.moveTo(this.trail[0][0], this.trail[0][1])
      for (let i = 1; i < this.trail.length; i++) {
        const [x, y] = this.trail[i]
        ctx.lineTo(x, y)
      }

      ctx.stroke()
    }

    // 绘制火花
    this.sparks.forEach((spark) => {
      ctx.beginPath()
      ctx.arc(spark.x, spark.y, this.sparkSize * spark.life, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${spark.life})`
      ctx.fill()
    })

    // 重置阴影
    ctx.shadowBlur = 0
  }
}

// 粒子类
class Particle {
  constructor(x, y, mainColor) {
    this.x = x
    this.y = y

    // 创建更有规律的放射状效果
    const angleVariation = (Math.random() - 0.5) * 0.3 // 小角度随机变化
    this.angle = Math.PI * 2 * Math.random() + angleVariation

    // 速度更集中，创造更统一的绽放效果
    const baseSpeed = 18
    this.speed = baseSpeed + (Math.random() - 0.5) * 5

    // 调整物理参数使运动更像真实烟花
    this.friction = 0.96
    this.gravity = 0.45

    // 粒子大小随距离变化
    this.baseSize = Math.random() * 2.5 + 1.5
    this.size = this.baseSize

    // 亮度和透明度
    this.brightness = Math.random() * 40 + 60
    this.alpha = 1
    this.decay = Math.random() * 0.01 + 0.005

    // 定义烟花颜色配置
    const colors = [
      { hue: 350, saturation: 100, probability: 0.25 }, // 粉色
      { hue: 45, saturation: 100, probability: 0.2 }, // 金色
      { hue: 280, saturation: 100, probability: 0.2 }, // 紫色
      { hue: 0, saturation: 100, probability: 0.15 }, // 红色
      { hue: 180, saturation: 85, probability: 0.1 }, // 青色
      { hue: 0, saturation: 0, probability: 0.1 } // 白色（用于点缀）
    ]

    // 选择颜色
    let random = Math.random()
    let sum = 0
    this.color = colors[0] // 默认为粉色
    for (let c of colors) {
      sum += c.probability
      if (random <= sum) {
        this.color = c
        break
      }
    }

    this.updateColor()
  }

  updateColor() {
    // 特殊处理金色
    if (this.color.hue === 45) {
      // 金色
      const goldLightness = Math.min(90, this.brightness + 20)
      this.colorStr = `hsla(${this.color.hue}, ${this.color.saturation}%, ${goldLightness}%, ${this.alpha})`
    }
    // 特殊处理白色
    else if (this.color.saturation === 0) {
      this.colorStr = `hsla(0, 0%, 100%, ${this.alpha})`
    }
    // 其他颜色
    else {
      this.colorStr = `hsla(${this.color.hue}, ${this.color.saturation}%, ${this.brightness}%, ${this.alpha})`
    }
  }

  update() {
    // 速度衰减
    this.speed *= this.friction

    // 计算移动距离
    const moveX = Math.cos(this.angle) * this.speed
    const moveY = Math.sin(this.angle) * this.speed + this.gravity

    // 更新位置
    this.x += moveX
    this.y += moveY

    // 粒子大小随距离衰减
    const speedFactor = Math.max(0.4, this.speed / 15)
    this.size = this.baseSize * speedFactor

    // 透明度衰减
    if (this.speed < 3) {
      this.decay *= 1.15 // 速度变慢时加快消失
    }
    this.alpha = Math.max(0, this.alpha - this.decay)

    this.updateColor()
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.colorStr
    ctx.shadowBlur = 15
    ctx.shadowColor = this.colorStr
    ctx.fill()
    ctx.shadowBlur = 0 // 重置阴影，避免影响其他绘制
  }
}

// 创建爆炸粒子
function createParticles(x, y) {
  // 主要绽放效果
  const mainParticleCount = 80
  for (let i = 0; i < mainParticleCount; i++) {
    particles.push(new Particle(x, y))
  }

  // 创建中心爆炸点的亮点
  for (let i = 0; i < 10; i++) {
    const centerParticle = new Particle(x, y)
    centerParticle.speed = Math.random() * 4 + 2
    centerParticle.size = Math.random() * 4 + 3
    centerParticle.decay = Math.random() * 0.02 + 0.02
    particles.push(centerParticle)
  }

  // 创建外围散开的小粒子
  setTimeout(() => {
    const outerParticleCount = 40
    for (let i = 0; i < outerParticleCount; i++) {
      const outerParticle = new Particle(x, y)
      outerParticle.speed = Math.random() * 10 + 10
      outerParticle.size = Math.random() * 1.5 + 0.5
      outerParticle.decay = Math.random() * 0.02 + 0.015
      particles.push(outerParticle)
    }
  }, 50) // 短暂延迟，创造爆炸扩散的效果
}

// 发射新烟花
function launchFirework() {
  const startX = Math.random() * canvas.value.width
  const startY = canvas.value.height
  // 目标高度在画布上半部分，且有一定的最低高度
  const targetY = canvas.value.height * (0.15 + Math.random() * 0.3)

  fireworks.push(new Firework(startX, startY, startX, targetY))
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
