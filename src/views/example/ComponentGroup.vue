<script setup>
import { SuccessFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
const tip = ref('操作成功')
const value1 = ref(60)
const value = ref('')
const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]
const formatTooltip = (val) => {
  return val / 1
}
</script>

<template>
  <div class="container">

    <div class="slide-block">
      <div class="slider-demo-block">

        <el-slider
          v-model="value1"
          :format-tooltip="formatTooltip"
        />
      </div>
      <div class="slider-demo-block">

        <el-select
          v-model="value"
          clearable
          placeholder="Select"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

    </div>

  </div>
</template>

<style scoped lang="less">
.container {
  display: flex;
}
.slider-demo-block {
  display: flex;
  align-items: center;
  width: 300px;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.slider-demo-block .demonstration {
  font-size: 14px;

  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
.slider-demo-block .demonstration + .el-slider {
  flex: 0 0 70%;
}
</style>