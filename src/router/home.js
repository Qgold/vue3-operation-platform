import Layout from "../components/Layout.vue";  
import permission from "../directives/permission";
export const homeRoutes = [
  {
    path: "/",
    component: Layout,
    meta: { title: "首页",  icon:'ce-zhanghuguanliicon',isMenu:true ,permission: "home" },
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "index",
        component: ()=>import("../views/Index.vue"),
        meta: { title: "数据看板" ,icon:'ce-zichanicon',keepAlive:true,isMenu:true,permission: "home:index" },
      },
       {
        path: "/home",
        name: "home",
        component: ()=>import("../views/Home.vue"),
        meta: { title: "主页" ,icon:'ce-zichanicon',permission: "home:index" },
      },
       {
        path: "/tree",
        name: "tree",
        component: ()=>import("../views/TreeVue.vue"),
        meta: { title: "树状结构" ,icon:'ce-zichanicon',permission: "home:index" },
      },
    ],
  }
]