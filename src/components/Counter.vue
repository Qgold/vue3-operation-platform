<template>
  <div class="counter-container">
    <div class="prefix">{{ prefix }}</div>
    <div id="counter">
      <div
        v-for="digit in String(TARGET_NUMBER).split('')"
        :key="digit"
        class="digit-container"
      >
        <div
          class="digit-list"
          ref="digitLists"
        >
          <div
            v-for="i in ROLL_COUNT + 1"
            :key="i"
          >
            <div
              v-for="j in 10"
              :key="j"
              class="digit"
            >{{ j - 1 }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="suffix">{{ suffix }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs, watchEffect } from 'vue'

// 配置常量
const DURATION = 2000 // 动画持续时间（毫秒）
const ROLL_COUNT = 2 // 数字滚动的额外循环次数
const DELAY_BETWEEN_DIGITS = 40 // 数字之间的延迟时间（毫秒）
const DIGIT_HEIGHT = 60 // 数字高度（像素）
const TARGET_NUMBER = 7140909 // 目标数字

const digitLists = ref([])

defineProps({
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  num: {
    type: Number,
    default: 7140909
  }
})
onMounted(() => {
  // 为每个数字列表设置动画
  setTimeout(() => {
    const digits = String(TARGET_NUMBER).split('')
    digitLists.value.forEach((list, index) => {
      const delay = (digits.length - index - 1) * DELAY_BETWEEN_DIGITS
      list.style.transition = `transform ${DURATION - delay}ms ease-in-out`

      const targetDigit = parseInt(digits[index], 10)
      const extraRolls = ROLL_COUNT * 10
      const targetY = -(extraRolls + targetDigit) * DIGIT_HEIGHT

      list.style.transform = `translateY(${targetY}px)`
    })
  }, 100)
})
</script>

<style scoped lang="less">
#counter {
  display: flex;
}
.digit-container {
  width: 40px;
  height: 60px;
  overflow: hidden;
  position: relative;
  margin: 0 2px;
}
.counter-container {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  height: 100px;
}

.digit-list {
  position: absolute;
  transition: transform 2s ease-in-out;
  transform: translateY(0);
}

.digit {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  height: 60px;
  font-weight: bold;
}

.prefix,
.suffix {
  font-size: 24px;
  margin: 0 10px;
  align-self: center;
}
</style>