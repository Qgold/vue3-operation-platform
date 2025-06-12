<script setup>
</script>
<template>
  <div class="not-found">
    <div class="windmill">
      <div class="blade"></div>
      <div class="blade"></div>
      <div class="blade"></div>
      <div class="blade"></div>
    </div>
    <p class="font-bold">您的网页不见了......</p>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  width: 100vw;
}

.windmill {
  position: relative;
  width: 100px;
  height: 100px;
  animation: spin 2s linear infinite;
}

.blade {
  position: absolute;
  width: 10px;
  height: 50px;
  background-color: var(--primary-color);
  top: 0;
  left: 50%;
  transform-origin: bottom center;
}

.blade:nth-child(1) {
  transform: rotate(0deg);
}

.blade:nth-child(2) {
  transform: rotate(90deg);
}

.blade:nth-child(3) {
  transform: rotate(180deg);
}

.blade:nth-child(4) {
  transform: rotate(270deg);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

p {
  margin-top: 20px;
  font-size: 2rem;
  color: var(--primary-color);
}
</style>

