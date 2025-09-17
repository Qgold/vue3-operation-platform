import { createRouter, createWebHistory } from "vue-router";
import Layout from "../components/Layout.vue";
import { loginRoutes } from './login.js'
import { promotionRoutes } from './promotion.js'
import { customerRoutes } from './customer.js'
import { technologyRoutes } from "./technology.js";
import { chainRoutes } from "./chain.js";
import { useAppStore } from "../store/app.js";
import { dashboardRoutes } from "./dashboard.js";
import { homeRoutes } from "./home.js";
import { systemRoutes } from "./system.js";
import { permissionRoutes } from "./permission.js";
import {settingRoutes} from "./setting.js"
import { exampleRoutes } from "./example.js";
export const routes = [
  ...loginRoutes,
  ...homeRoutes,
  ...dashboardRoutes,
  ...chainRoutes,
  ...customerRoutes,
  ...promotionRoutes,
  ...settingRoutes,
  ...permissionRoutes, 
  ...systemRoutes,
  ...technologyRoutes,
  ...exampleRoutes,
  
  {
    name:'website',
    path:'/website',
    meta: { title: "网站" ,isMenu:false},
    component:()=>import('../views/Website2.vue'),
  },
  {
    name:'bigScreen',
    path:'/bigScreen',
    meta: { title: "大屏" ,isMenu:false },
    component:()=>import('../views/Website2.vue'),
    
  },
  {
    name:  "report",
    path: "/report",
    meta: { title: "公告",icon:'cebianlan-treasury'  ,isMenu:true },
    component: Layout,
    children: [{
      path: "/tip",
      name: "tip",
      component: ()=>import("../views/Blog.vue"),
      meta: { title: "提醒"   },
    },
    {
      path: "/notice",
      name: "notice",
      component: ()=>import("../views/Notice.vue"),
      meta: { title: "通知" ,isMenu:true  },
    }],
   
  },  
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: Layout,
    meta: { title: '404 Not Found', isMenu: false },
    whiteUser: true,
    children: [
      {
        path: '',
        component: () => import('../views/404.vue'),
        meta: { title: '404 Not Found', isMenu: false }
      }
    ]
  },
 
  // ...其他路由配置保持不变
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Add a navigation guard for token-based redirection
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  const app = useAppStore()

  //   app.$patch({
  //   menuList: routes.filter((i) => i?.meta?.isMenu)
  // })
  if (!token && !app.whiteList.includes(to.path)) {
    next({ path: '/login' })
  } else {
    if(app.hasPermission(to.path)){
      //  ElMessage.error('没有访问权限')
       next(true)
    }else {
       if (to.path === '/') {
        next({ name: 'index' })
      } else {  
        next()
      }
    }  
  }
})

export default router
