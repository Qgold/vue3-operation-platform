<template>
  <div
    class="progress-container"
    :style="containerStyle"
  >
    <svg
      class="progress-ring"
      viewBox="0 0 120 120"
    >
      <!-- 背景圆环 -->
      <circle
        class="progress-ring__circle progress-ring__background"
        :style="{ stroke: inactiveColor }"
        :r="radius"
        cx="60"
        cy="60"
      ></circle>
      <!-- 进度圆环 -->
      <circle
        class="progress-ring__circle progress-ring__progress"
        :style="{ 
          stroke: activeColor, 
          strokeDashoffset: strokeDashoffset 
        }"
        :r="radius"
        cx="60"
        cy="60"
      ></circle>
    </svg>
    <div
      class="progress-text"
      :style="{ color: textColor }"
    >
      {{ Math.round(progress) }}%
    </div>

    <!-- SVG 滤镜定义 (在组件内部，不会污染全局) -->
    <svg
      width="0"
      height="0"
      style="position: absolute"
    >
      <filter :id="filterId">
        <feTurbulence
          ref="turbulenceFilter"
          type="fractalNoise"
          :baseFrequency="`${frequency} ${frequency}`"
          :numOctaves="octaves"
          result="turbulenceResult"
        >
          <animate
            attributeName="baseFrequency"
            dur="10s"
            :values="`${frequency} ${frequency};${frequency + 0.03} ${frequency - 0.03};${frequency} ${frequency};`"
            repeatCount="indefinite"
          >
          </animate>
        </feTurbulence>
        <feDisplacementMap
          ref="displacementMapFilter"
          in="SourceGraphic"
          in2="turbulenceResult"
          :scale="scale"
          xChannelSelector="R"
          yChannelSelector="G"
        >
        </feDisplacementMap>
      </filter>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect, onMounted } from 'vue'

// 定义组件接收的 Props
const props = defineProps({
  size: { type: Number, default: 250 },
  progress: { type: Number, default: 50, validator: (v) => v >= 0 && v <= 100 },
  strokeWidth: { type: Number, default: 20 },
  scale: { type: Number, default: 15 },
  frequency: { type: Number, default: 0.05 },
  octaves: { type: Number, default: 2 },
  activeColor: { type: String, default: '#0158f0' },
  inactiveColor: { type: String, default: '#333' },
  textColor: { type: String, default: '#0158f0' }
})

// 生成一个唯一的 ID，避免多个组件实例之间滤镜冲突
const filterId = `wobble-filter-${Math.random().toString(36).substring(7)}`

// --- 响应式计算 ---
const radius = 40
const circumference = 2 * Math.PI * radius

// 计算进度条的偏移量
const strokeDashoffset = computed(() => {
  return circumference - (props.progress / 100) * circumference
})

// 计算容器样式
const containerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`
}))

// --- DOM 引用 (虽然Vue会自动更新属性，但保留引用以备将来更复杂的操作) ---
const turbulenceFilter = ref(null)
const displacementMapFilter = ref(null)

onMounted(() => {
  // 可以在这里访问 DOM 元素
  // console.log(turbulenceFilter.value);
})
</script>

<style scoped>
.progress-container {
  position: relative;
  display: inline-block; /* 改为 inline-block 以适应 size prop */
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  /* 动态应用滤镜 */
  filter: v-bind('`url(#${filterId})`');
}

.progress-ring__circle {
  fill: none;
  stroke-width: v-bind('strokeWidth');
  transition: stroke-dashoffset 0.35s ease;
  stroke-dasharray: v-bind('`${circumference} ${circumference}`');
}

.progress-ring__progress {
  stroke-linecap: round;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: v-bind('`${size * 0.1}px`'); /* 字体大小与容器大小关联 */
  font-weight: bold;
}
</style>

