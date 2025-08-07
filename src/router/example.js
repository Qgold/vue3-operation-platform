import Layout from "../components/Layout.vue";
export const exampleRoutes = [
      {
        path:'/example',
        name:'example',
        component:Layout,
        meta: { title: "页面示例",icon:'ce-shujufuwuicon',isMenu:true },
        children:[
          {
            path:'/result',
            name:'result',
            component:()=>import("../views/example/Result.vue"),
            meta: { title: "结果页",icon:'yijianfankui',isMenu:true },
          },
           {
            path:'/list',
            name:'list',
            component:()=>import("../views/example/List.vue"),
            meta: { title: "列表",icon:'yijianfankui' ,isMenu:true},
          },
          {
            path:'/groupForm',
            name:'groupForm',
            component:()=>import("../views/example/GroupForm.vue"),
            meta: { title: "分组表单",icon:'yijianfankui' ,isMenu:true},
          },
        //   {
        //     path:'/logisticsTracking',
        //     name:'logisticsTracking',
        //     component:()=>import("../views/chain/LogisticsTracking.vue"),
        //     meta: { title: "物流跟踪",icon:'yijianfankui' ,isMenu:true},
        //   },
          
        ]
      }
]