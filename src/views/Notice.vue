<script setup>
// import G2 from '@antv/g2'
import { ref, onMounted, reactive } from 'vue'
import { useAppStore } from '../store/app.js'

const app = useAppStore()
const showNoticeDialog = ref(false)
const newNotice = reactive({
  title: '',
  content: '',
  type: ''
})
const options = reactive([
  { value: 'danger', label: '紧急' },
  { value: 'info', label: '日常' },
  { value: 'warning', label: '警告' }
])
const notices = ref([
  '通知1：系统维护通知',
  '通知2：新功能上线通知',
  '通知3：版本更新通知',
  '通知4：活动公告'
])
onMounted(() => {
  // const clock = new FlipClock(document.querySelector('#clock'), {
  //   clockFace: 'TwentyFourHourClock',
  //   autoStart: true
  // })
})
</script>

<template>
  <div class="card-container">
    <el-alert
      title="系统将于今晚12点进行维护，请提前保存您的工作。"
      type="warning"
      show-icon
      closable
    />
    <el-row>
      <el-button
        type="primary"
        class="mt-4"
        @click="showNoticeDialog = true;"
      >创建公告</el-button>
    </el-row>
    <el-row
      :gutter="20"
      class="mt-4"
    >
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header flex justify-between">
              <span>紧急通告</span>
              <el-tag type="danger">危险</el-tag>
            </div>
          </template>
          <div class="card-content">
            这是一段紧急通知，请大家注意查看自己的任务是否保存，确保断电导致的影响降到最低
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header flex justify-between">
              <span>日常通知</span>
              <el-tag type="info">日常</el-tag>
            </div>
          </template>
          <div class="card-content">
            请大家注意时间，距离项目收尾还有一周的时间，请大家一定要保证质量的完成项目的开发任务
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      class="mt-4"
    >
      <el-col :span="24">
        <el-card>
          <div class="notice">
            <el-carousel
              height="150px"
              autoplay
              interval="3000"
              arrow="always"
            >
              <el-carousel-item
                v-for="(item, index) in notices"
                :key="index"
              >
                <div class="carousel-item-content">{{ item }}</div>
              </el-carousel-item>
            </el-carousel>
          </div>

        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="创建公告"
      v-model="showNoticeDialog"
      width="30%"
    >
      <el-form>
        <el-form-item
          label="公告标题"
          label-width="80px"
        >
          <el-input
            v-model="newNotice.title"
            placeholder="请输入公告标题"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="公告内容"
          label-width="80px"
        >
          <el-input
            type="textarea"
            v-model="newNotice.content"
            placeholder="请输入公告内容"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="公告类型"
          label-width="80px"
        >
          <el-select
            v-model="newNotice.type"
            placeholder="请选择公告类型"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="showNoticeDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="addNotice"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.card-container {
  // width: 100%;
}

.card-container::-webkit-scrollbar {
  display: none;
  width: 0;
}
.card-header {
  // display: flex;
  // justify-content: space-between;
}
.card-content {
  font-size: 0.8rem;
  color: #121212;
  text-align: left;
}
</style>