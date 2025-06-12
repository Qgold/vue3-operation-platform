<script setup>
// import G2 from '@antv/g2'

import TreeChart from '../../components/TreeChart.vue'

const treeData = {
  name: '徐工集团机械股份有限公司',
  children: [
    {
      name: '全球数字化中心',
      children: [
        {
          name: '研发数字化部',
          children: [{ name: '张煜' }, { name: 'xxx' }, { name: 'xxxx' }]
        },
        {
          name: '供应链数字化部',
          children: [{ name: '张煜' }, { name: 'xxx' }, { name: 'xxxx' }]
        },
        {
          name: 'IT软件与AI赋能部',
          children: [{ name: '张煜' }, { name: 'xxx' }, { name: 'xxxx' }]
        },
        { name: '营销数字化' },
        { name: '制造与质量数字化部' }
      ]
    },
    {
      name: '徐工重型',
      children: [{ name: '国内销售' }, { name: '海外销售' }]
    },
    {
      name: '徐工汽车',
      children: [{ name: '国内销售' }, { name: '海外销售' }]
    },
    {
      name: '徐工矿机',
      children: [{ name: '国内销售' }, { name: '海外销售' }]
    },
    {
      name: '徐工铲运',
      children: [{ name: '国内销售' }, { name: '海外销售' }]
    }
  ]
}
</script>

<template>
  <div>

    <el-row class="mt-4">
      <el-col :span="24">
        <el-card>
          <TreeChart
            :data="treeData"
            title="组织架构图"
            height="600px"
            orient="horizontal"
            :node-gap="30"
            :initial-tree-depth="3"
          />
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<style scoped lang="less">
</style>