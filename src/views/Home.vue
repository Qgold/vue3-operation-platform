<script setup>
import { ref } from 'vue'
import avator from '../assets/avator.jpg'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const info = ref({
  name: '张煜',
  engName: 'coco',
  age: 31,
  birthday: '1990-01-01',
  school: '南京邮电大学',
  address: '江苏省徐州市云龙区佳泰雅园4单元1栋1103',
  phone: '19025117623',
  unit: '徐工集团',
  email: 'zylovehcc1102@163.com'
  // avator: '../assets/avator.jpg'
})
const dialogVisible = ref(false)
const handleClose = (done) => {
  ElMessageBox.confirm('是否确认关闭这个弹窗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>

<template>
  <div class="home-introduction">
    <div class="t">{{$t('userTitle')}}：</div>
    <el-form>
      <el-form-item :label="$t('avator')+':'">
        <el-image
          style="width: 100px; height: 100px"
          :src="avator"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="[avator]"
          :initial-index="4"
          fit="cover"
        />

      </el-form-item>
      <el-form-item :label="$t('userName')+':'">
        <el-input
          v-model="info.name"
          placeholder="请输入内容"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('engName')+':'">
        <el-input
          v-model="info.engName"
          placeholder="请输入内容"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('age')+':'">
        <el-input
          v-model="info.age"
          placeholder="请输入内容"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('birthday')+':'">
        <el-input
          v-model="info.birthday"
          placeholder="请输入内容"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('school')+':'">
        <el-input
          v-model="info.school"
          placeholder="请输入内容"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('address')+':'">
        <el-input
          v-model="info.address"
          placeholder="请输入内容"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="电话:">
        <el-input
          v-model="info.phone"
          placeholder="请输入内容"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="工作单位:">
        <el-input
          v-model="info.unit"
          placeholder="请输入内容"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-input
          v-model="info.email"
          placeholder="请输入内容"
          disabled
        ></el-input>
      </el-form-item>
      <el-row
        :gutter="20"
        justify="left"
        align="middle"
      >
        <el-col :span="1"> <el-button @click="dialogVisible=true;">提交</el-button></el-col>
        <el-col :span="1"> <el-button type="primary">取消</el-button></el-col>
      </el-row>
    </el-form>
    <el-dialog
      v-model="dialogVisible"
      title="提示"
      width="30%"
      :before-close="handleClose"
    >
      <span>是否确认提交?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click=" dialogVisible= false">{{ $t('cancel') }}</el-button>
          <el-button
            type="primary"
            @click="router.push('/home/detail')"
          >
            {{ $t('confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.home-introduction {
  .t {
    text-align: left;
    font-weight: bold;
    margin-bottom: 16px;
  }
}
.avator {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
