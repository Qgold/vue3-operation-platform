<script setup>
import { h } from 'vue'
import Helloworld from './Helloworld.vue'
const Comp = () => {
  return h(Helloworld, {
    msg: 'hello',
    onFoo: (text) => {
      //   alert(text)
    }
  })
}
</script>

<template>
  <Comp></Comp>

</template>