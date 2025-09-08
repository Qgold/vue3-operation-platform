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
    ],
  }
]