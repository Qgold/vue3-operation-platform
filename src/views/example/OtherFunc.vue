<script setup>
import { SuccessFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
const tip = ref('操作成功')
const list = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
</script>

<template>
  <div class="grid">
    <div
      class="item"
      v-for="(item,index) in list"
    >
      {{  item  }}
    </div>
  </div>
</template>

<style scoped lang="less">
/* 父元素 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* 子元素 */
.item {
  height: 200px;
  background-color: var(--primary-color);
  border-radius: 4px;
  margin-left: 10px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
</style>