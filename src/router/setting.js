import Layout from "../components/Layout.vue";
export const settingRoutes = [
    {
        path:'/setting',
        name:'setting',
        component:Layout,
        meta: { title: "配置管理",icon:'ce-yonghuguanliicon'  ,isMenu:true },
        children:[
           {
            path:'/setting/manage',
            name:'settingManage',
            component:()=>import("../views/setting/Manage.vue"),
            meta: { title: "系统配置",icon:'zhanghuguanli' ,isMenu:true  },
          },
          {
            path:'/setting/business',
            name:'business',
            component:()=>import("../views/setting/Business.vue"),
            meta: { title: "业务配置",icon:'zhanghuguanli' ,isMenu:true  },
          },
          
        ]
      }
]