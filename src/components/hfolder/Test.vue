
<script setup>
import { h } from 'vue'
const com = h(
  'div',
  {
    style: { color: 'red', cursor: 'pointer' },
    onClick: () => {
      alert('点击了')
    }
  },
  '这是一个测试组件'
) //vnode
</script>

<template>
  <component :is="com" />
</template>