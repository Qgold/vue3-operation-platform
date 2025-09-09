import { createApp,h } from "vue";
import "./style.css";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "./router";
import { createPinia } from "pinia";
import { createI18n } from 'vue-i18n'
import en from './locales/en'
import zh from './locales/zh'
import zhTw from './locales/zh-tw'
import http from './api/http'
import { ElLoading } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { Steps as Tsteps, StepItem as TStepItem, InputNumber as TInputNumber } from 'tdesign-vue-next';
import permissionDirective from './directives/permission'
import 'tdesign-vue-next/es/style/index.css';

import XcmgComponents from 'xcmg-components'

import 'xcmg-components/dist/style.css'

import { useAppStore } from "./store/app.js";
import VueGridLayout from 'vue-grid-layout'
// import Vue from 'vue'
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (prefersDark) {
  document.documentElement.classList.add("dark");
}

// 暴露切换方法到全局
window.toggleDarkMode = function () {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "darkMode",
    document.documentElement.classList.contains("dark")
  );
};

// 初始化时读取本地存储
if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}else{
  document.documentElement.classList.remove("dark");

}

const app = createApp(App);
app.use(VueGridLayout);
// 将 Axios 实例挂载到 Vue 的原型上
// app.config.globalProperties.$http = http;
app.provide('http', http)

// 使 v-highlight 在所有组件中都可用
app.directive("highlight", {
  /* ... */
  mounted(el, binding) {
    el.classList.add("highlight");
  },
});
// App.prototype.$http = http;
// Vue.prototype.$http = http; // 将axios实例挂载到Vue的原型上，以便在组件中使用

// const el=document.getElementById('app')
// let width=1920
// let height=1080
// el.style.transformOrigin="top left"
// function init(){
//     const scaleX=innerWidth/width
//     const scaleY=innerHeight/height
//     const scale=Math.min(scaleX,scaleY)
//     const left=(innerWidth-width*scale)/2
//     const top=(innerHeight-height*scale) /2

//     el.style.transform=`translate(${left}px,${top}px) scale(${scale})`
// }
// init()
// addEventListener('resize',()=>{
//     init()
// })
const i18n = createI18n({
  locale: 'zh-CN', // 设置默认语言
  fallbackLocale: 'zh-CN', // 设置回退语言
  messages: {
    "en-US":en,
    "zh-CN": zh,
    'zh-TW': zhTw,
  },
});

app.use(createPinia());
const appStore = useAppStore();
const rolePermissions = localStorage.getItem('rolePermissions') //根据查询用户的权限列表（根据角色ID）
const isCollapse = localStorage.getItem('isCollapse') //菜单展开收起

if (rolePermissions) {
  const roleP = JSON.parse(rolePermissions)
  appStore.$patch({ rolePermissions:roleP  })
  appStore.setCurrentRolePermissions('1')
}

if (isCollapse) {
    appStore.$patch({ isCollapse: isCollapse == 'true' ? true : false })
}
app.use(ElementPlus,{
  locale: zhCn,

  
});
app.use(router);
app.use(i18n);
app.use(Tsteps);
app.use(TStepItem);
app.use(TInputNumber);
app.use(XcmgComponents)
app.directive('permission', permissionDirective)
app.mount("#app");
