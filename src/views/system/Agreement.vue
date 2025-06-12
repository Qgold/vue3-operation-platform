<template>
  <div class="agreement-container">
    <h2 class="page-title">用户协议</h2>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="用户服务协议"
        name="1"
      >
        <div class="agreement-content">
          <h3>一、总则</h3>
          <p>1.1 用户应当同意本协议的条款并按照页面上的提示完成全部的注册程序。</p>
          <p>1.2 用户在注册过程中点击"同意"按钮即表示用户完全接受本协议的全部条款。</p>
        </div>
      </el-collapse-item>

      <el-collapse-item
        title="隐私政策"
        name="2"
      >
        <div class="agreement-content">
          <h3>一、信息收集</h3>
          <p>1.1 我们可能收集您的个人身份信息、使用数据等信息。</p>
          <p>1.2 我们承诺对您的个人信息进行严格保密。</p>
        </div>
      </el-collapse-item>

      <el-collapse-item
        title="服务条款"
        name="3"
      >
        <div class="agreement-content">
          <h3>一、服务内容</h3>
          <p>1.1 本服务条款适用于所有使用我们提供的服务的用户。</p>
          <p>1.2 我们保留随时修改或中断服务的权利。</p>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeNames = ref(['1']) // 默认展开第一个协议
</script>

<style scoped lang="less">
.agreement-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 20px;
  color: #303133;
  font-size: 24px;
}

.agreement-content {
  padding: 10px;
}

.agreement-content h3 {
  margin: 10px 0;
  color: #303133;
  font-size: 18px;
}

.agreement-content p {
  margin: 8px 0;
  line-height: 1.6;
  color: #606266;
}
</style>