<script setup>
import { routes } from '../router/index.js'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { useAppStore } from '../store/app.js'
import { useRouter } from 'vue-router'
const app = useAppStore()
const isCollapse = ref(false)
const route = useRoute()
const router = useRouter()

// const handleSelect = (index) => {
//   router.push(index)
// }

watch(
  () => app.isCollapse,
  (val) => {
    isCollapse.value = val
  },
  { immediate: true }
)

onMounted(() => {
  // 获取当前路由的索引
  // this.routeList.value = routes.filter(
  //   (item) => item.meta && item.meta.hidden === undefined
  // )
})
</script>

<template>
  <div class="menu-container">
    <el-menu
      :default-active="route.path"
      class="el-menu-vertical"
      mode="vertical"
      :collapse="isCollapse"
      :router="true"
    >
      <template
        v-for="(item, index) in routes.filter(i=>i?.meta?.isMenu)"
        :index="item.path"
        :key="index"
      >
        <!-- 有子路由的菜单项 -->
        <el-sub-menu
          v-if="item.children && item.children.length > 0"
          :index="item.path"
        >
          <template #title>
            <i
              class="iconfont"
              :class="'icon-'+item.meta.icon"
              v-if="item.meta.icon"
            ></i>

            <span style="margin-left:10px;">{{ item.meta?.title }}</span>
          </template>
          <el-menu-item
            v-for="(child, childIndex) in item.children.filter(item=>item?.meta?.isMenu)"
            :key="childIndex"
            :index="child.path"
          >
            <!-- <i
              class="iconfont"
              :class="'icon-'+child.meta.icon"
              v-if="child.meta.icon"
            ></i> -->
            <span>{{ child.meta?.title }} {{  child.hidden }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 没有子路由的菜单项 -->
        <el-menu-item
          v-else
          :index="item.path"
        >
          <i
            class="iconfont"
            :class="'icon-'+item.meta.icon"
            v-if="item.meta.icon"
          ></i>
          <span style="margin-left:10px;">{{ item.meta?.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.menu-container {
  height: 100%;
  overflow-y: auto;
  padding: auto 8px;
}
.menu-container::-webkit-scrollbar {
  display: none;
  width: 0;
}

.el-menu-vertical {
  border-right: none;
}
</style>