<script setup>
import { h, ref } from 'vue'
const msg = ref('ref文字')
const com = (props, { slots }) =>
  h(
    'div',
    {
      style: { color: 'red', cursor: 'pointer' },
      onClick: () => {
        msg.value = '更改后的msg'
      }
    },
    [slots.default(), props.text + '-------' + msg.value, slots.header()]
  )
</script>

<template>
  <component
    :is="com"
    text="这是props传入的一段文字"
  >
    <div>这是插槽内容</div>
    <template #header>
      <div>这是具名插槽Header</div>
    </template>

  </component>
</template>