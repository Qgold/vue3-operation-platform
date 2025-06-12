<script setup>
import Layout from './Layout.vue'
import Menu from './Menu.vue'
import Footer from './Footer.vue'
</script>
<template>
  <Layout>
    <template #sidebar>

      <Menu />
    </template>

    <template #footer>
      <!-- 自定义页脚内容 -->
      <Footer />
    </template>
  </Layout>
</template>