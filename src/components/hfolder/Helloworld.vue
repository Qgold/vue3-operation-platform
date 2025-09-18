<script setup >
import { defineProps, defineEmits } from 'vue'

defineProps(['msg'])
const emits = defineEmits(['foo'])

setTimeout(() => {
  emits('foo', 'HelloWorld')
}, 1000)
</script>

<template>
  <div>
    {{ msg }}
  </div>
</template>
