import Layout from "../components/Layout.vue";  
export const homeRoutes = [
  {
    path: "/",
    component: Layout,
    meta: { title: "首页",  icon:'ce-zhanghuguanliicon',isMenu:true },
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "index",
        component: ()=>import("../views/Index.vue"),
        meta: { title: "主页" ,icon:'ce-zichanicon',keepAlive:true,isMenu:true},
        
      },
      {
        path: "/home",
        name: "home",
        component: ()=>import("../views/Home.vue"),
        meta: { title: "自我介绍",  icon:'ce-jinrongchanpinicon',isMenu:true},
      
      },
      {
        path: "/home/detail",
        name: "homeDetail",
        component: ()=>import("../views/Notice.vue"),
        meta: { title: "自我介绍详情",  icon:'ce-jinrongchanpinicon',isMenu:false },
   
      },
      {
        path: "/history",
        name: "history",
        component:()=>import("../views/History.vue"),
        meta: { title: "经历",  icon:'ce-quanxianguanliicon',isMenu:true },   
      },
    ],
  }
]