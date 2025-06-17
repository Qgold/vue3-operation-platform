<template>
  <div class="footer-content">
    <div
      class="footer-left"
      :class="{ 'collapsed': app.isCollapse }"
    >
      <span
        class="iconfont icon-zidingyizhibiao"
        :class="{ 'rotate': app.isCollapse }"
        @click="toggle"
        title="折叠菜单"
      />
    </div>
    <div class="line"></div>
    <div class="footer-right">
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from '../store/app.js'
const app = useAppStore()
const toggle = () => {
  app.setIsCollapse(!app.isCollapse)
}
</script>

<style scoped lang="less">
.footer-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.footer-left {
  width: 214px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  height: 40px;
  transition: all 0.3s ease-in-out;

  .iconfont {
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
    color: var(--main-text-color);

    &.rotate {
      transform: rotate(180deg);
    }

    &:hover {
      color: var(--primary-color);
    }
  }

  &.collapsed {
    width: 64px;
  }
}

.line {
  width: 20px;
  height: var(--footer-height);
  background: var(--line-color);
  opacity: 0.6;
}

.footer-right {
  flex: 1;
  height: var(--footer-height);
}
</style>