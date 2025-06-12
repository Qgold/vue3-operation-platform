<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  //   setInterval(updateTime, 1000)
  //   updateTime() // Initialize immediately
})
function updateTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  updateFlipCard('.hours', hours)
  updateFlipCard('.minutes', minutes)
  updateFlipCard('.seconds', seconds)
}
function updateFlipCard(selector, newValue) {
  const card = document.querySelector(selector)
  const top = card.querySelector('.top')
  const bottom = card.querySelector('.bottom')

  if (top.textContent !== newValue) {
    top.textContent = newValue
    bottom.textContent = newValue
    card.classList.add('flip')
    setTimeout(() => card.classList.remove('flip'), 500)
  }
}
</script>

<template>
  <!-- <div class="flip-clock">
    <div class="flip-card hours">
      <div class="top">00</div>
      <div class="bottom">00</div>
    </div>
    <span class="separator">:</span>
    <div class="flip-card minutes">
      <div class="top">00</div>
      <div class="bottom">00</div>
    </div>
    <span class="separator">:</span>
    <div class="flip-card seconds">
      <div class="top">00</div>
      <div class="bottom">00</div>
    </div>
  </div> -->
</template>

<style scope lang="less">
.flip-clock {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  font-size: 3rem;
  color: #333;
}

.flip-card {
  position: relative;
  width: 60px;
  height: 80px;
  perspective: 200px;
  margin: 0 5px;
}

.top,
.bottom {
  position: absolute;
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #444;
  color: #fff;
  overflow: hidden;
  border-radius: 5px;
}

.top {
  top: 0;
  transform-origin: bottom;
  border-bottom: 1px solid #333;
}

.bottom {
  bottom: 0;
  transform-origin: top;
}

.separator {
  margin: 0 5px;
}

@keyframes flip {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(-180deg);
  }
}

.flip {
  animation: flip 0.5s ease-in-out;
}
</style>