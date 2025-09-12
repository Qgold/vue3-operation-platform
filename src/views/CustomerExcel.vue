<template>
  <div class="custom-report">
    <div class="toolbar">
      <el-button
        type="primary"
        @click="exportToExcel"
      >导出 Excel</el-button>
      <el-button
        type="primary"
        @click="exportToPDF"
      >导出 PDF</el-button>
      <el-button @click="saveTemplate">保存模板</el-button>
    </div>

    <div class="report-container">
      <div class="components-panel">
        <h3>组件列表</h3>
        <div
          v-for="item in componentList"
          :key="item.type"
          class="component-item"
          :draggable="true"
          @dragstart="handleDragStart($event, item)"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </div>
      </div>

      <div
        class="design-panel"
        @drop.stop="handleDrop"
        @dragover="handleDragOver"
      >
        <grid-layout
          v-model:layout="layout"
          :col-num="12"
          :row-height="30"
          :width="1200"
          :is-draggable="true"
          :is-resizable="true"
          :vertical-compact="true"
          :use-css-transforms="true"
          :margin="[10, 10]"
          class="grid-layout"
        >
          <grid-item
            v-for="item in layout"
            :key="item.i"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            @resize="handleResize"
          >
            <div class="grid-item-content">
              <div class="item-header">
                <span>{{ item.label }}</span>
                <el-icon
                  class="delete-icon"
                  @click="removeItem(item)"
                >
                  <Delete />
                </el-icon>
              </div>
              <!-- 表格组件特殊处理 -->
              <template v-if="item.component === 'el-table'">
                <el-table v-bind="getTableProps(item)">
                  <el-table-column
                    v-for="col in item.props.children"
                    :key="col.prop"
                    v-bind="col"
                  />
                </el-table>
              </template>
              <!-- select组件特殊处理 -->
              <template v-else-if="item.component === 'el-select'">
                <el-select
                  v-model="item.props.modelValue"
                  v-bind="getSelectProps(item)"
                  @update:modelValue="(val) => handleValueUpdate(item, val)"
                >
                  <el-option
                    v-for="option in item.props.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
              </template>
              <!-- 其他组件通用处理 -->
              <component
                v-else
                :is="componentsMap[item.component]"
                v-model="item.props.modelValue"
                v-bind="item.props"
                @update:modelValue="(val) => handleValueUpdate(item, val)"
              />
            </div>
          </grid-item>
        </grid-layout>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'

import {
  Delete,
  Setting,
  Menu,
  TrendCharts,
  Document
} from '@element-plus/icons-vue'
import {
  ElTable,
  ElTableColumn,
  ElInput,
  ElInputNumber,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElMessage
} from 'element-plus'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import MultiLine from '@/components/MultiLine.vue'

// 注册可用组件
const componentsMap = {
  'el-table': markRaw(ElTable),
  'el-input': markRaw(ElInput),
  'el-input-number': markRaw(ElInputNumber),
  'el-date-picker': markRaw(ElDatePicker),
  'el-select': markRaw(ElSelect),
  MultiLine: markRaw(MultiLine)
}

// 组件列表定义
const componentList = [
  {
    type: 'table',
    label: '表格',
    icon: Menu,
    component: 'el-table',
    props: {
      data: [
        { name: '测试1', amount: 100 },
        { name: '测试2', amount: 200 }
      ],
      border: true,
      stripe: true,
      children: [
        { prop: 'name', label: '名称', width: '180' },
        { prop: 'amount', label: '金额' }
      ]
    }
  },
  {
    type: 'chart',
    label: '图表',
    icon: TrendCharts,
    component: 'MultiLine',
    props: {
      chartType: 'line',

      data: [
        { date: '2024-01', value: 100 },
        { date: '2024-02', value: 200 },
        { date: '2024-03', value: 300 }
      ],
      xAxisData: "['周一', '周二', '周三', '周四', '周五', '周六', '周日']",
      series: [
        {
          name: '库存不足',
          data: [5, 4, 6, 3, 7, 4, 5]
        },
        {
          name: '库存积压',
          data: [3, 2, 4, 5, 3, 2, 4]
        }
      ],
      title: '活动效果趋势',
      height: 200,
      smooth: true,
      showArea: true
    }
  },
  {
    type: 'text',
    label: '文本',
    icon: Document,
    component: 'el-input',
    props: {
      modelValue: '',
      type: 'textarea',
      rows: 4,
      placeholder: '请输入内容'
    }
  },
  {
    type: 'number',
    label: '数字',
    icon: Document,
    component: 'el-input-number',
    props: {
      modelValue: 0,
      min: 0,
      max: 10000
    }
  },
  {
    type: 'date',
    label: '日期',
    icon: Document,
    component: 'el-date-picker',
    props: {
      modelValue: '',
      type: 'date',
      placeholder: '选择日期',
      valueFormat: 'YYYY-MM-DD'
    }
  },
  {
    type: 'div',
    label: '区域',
    icon: Document,
    component: 'div',
    props: {
      innerHTML: '区域内容',
      style: {
        border: '1px solid #dcdfe6',
        padding: '10px',
        backgroundColor: '#f5f7fa'
      }
    }
  },
  {
    type: 'select',
    label: '下拉',
    icon: Document,
    component: 'el-select',
    props: {
      modelValue: '',
      placeholder: '请选择',
      options: [
        { label: '选项A', value: 'A' },
        { label: '选项B', value: 'B' }
      ]
    }
  }
]

const layout = ref([])
let nextGridId = 1

// 处理组件值更新
const handleValueUpdate = (item, value) => {
  item.props.modelValue = value
  console.log(`Component ${item.label} updated:`, value)
}

// 获取表格属性
const getTableProps = (item) => {
  const { children, ...props } = item.props
  return props
}

// 获取下拉框属性
const getSelectProps = (item) => {
  const { options, ...props } = item.props
  return props
}

const handleDragStart = (e, item) => {
  e.dataTransfer.setData('component', JSON.stringify(item))
}

const handleDragOver = (e) => {
  e.preventDefault()
}

const handleDrop = (e) => {
  e.preventDefault()

  try {
    const componentData = JSON.parse(e.dataTransfer.getData('component'))
    const rect = e.target.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / (rect.width / 12))
    const y = Math.floor((e.clientY - rect.top) / 30)

    // 生成新的组件ID
    const itemId = String(nextGridId++)

    // 克隆 props 并添加更新处理函数
    const props = {
      ...componentData.props,
      onUpdate: (value) => handleValueUpdate(itemId, value)
    }

    layout.value = [
      ...layout.value,
      {
        x,
        y,
        w: 4,
        h: 4,
        i: itemId,
        label: componentData.label,
        component: componentData.component,
        props
      }
    ]

    console.log('Added component:', componentData.label)
  } catch (error) {
    console.error('Error in handleDrop:', error)
  }
}

const handleResize = (i, newH, newW) => {
  const item = layout.value.find((item) => item.i === i)
  if (item) {
    item.h = newH
    item.w = newW
  }
}

const removeItem = (item) => {
  const index = layout.value.findIndex((i) => i.i === item.i)
  if (index !== -1) {
    layout.value.splice(index, 1)
  }
}

const exportToExcel = async () => {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([['Custom Report']])
  XLSX.utils.book_append_sheet(wb, ws, 'Report')
  XLSX.writeFile(wb, 'custom-report.xlsx')
}

const exportToPDF = async () => {
  const element = document.querySelector('.design-panel')
  const canvas = await html2canvas(element)
  const pdf = new jsPDF('p', 'mm', 'a4')
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298)
  pdf.save('custom-report.pdf')
}

const saveTemplate = () => {
  const template = {
    layout: layout.value
  }
  localStorage.setItem('reportTemplate', JSON.stringify(template))
  ElMessage.success('模板保存成功')
}
</script>

<style scoped lang="less">
.custom-report {
}

.toolbar {
  margin-bottom: 20px;
}

.report-container {
  display: flex;
  gap: 20px;
  min-height: calc(100vh - 200px);
}

.components-panel {
  width: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: move;
  margin-top: 10px;
}

.component-item:hover {
  background-color: #f5f7fa;
}

.design-panel {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f5f7fa;
  min-height: 600px;
  position: relative;
}

.grid-layout {
  background: #f5f7fa;
  min-height: 600px;
  width: 100% !important;
}

:deep(.vue-grid-item) {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

:deep(.vue-grid-item.vue-grid-placeholder) {
  background: #f0f2f5 !important;
  border: 2px dashed #ccc;
  opacity: 0.7;
}

.grid-item-content {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.delete-icon {
  cursor: pointer;
  color: #f56c6c;
}

.delete-icon:hover {
  opacity: 0.8;
}
</style>