import Layout from "../components/Layout.vue";
export const chainRoutes = [
      {
        path:'/chain',
        name:'chain',
        component:Layout,
        meta: { title: "资源与供应链管理",icon:'ce-shujufuwuicon',isMenu:true },
        children:[
          {
            path:'/invertoryManager',
            name:'invertoryManager',
            component:()=>import("../views/chain/InvertoryManager.vue"),
            meta: { title: "库存管理",icon:'yijianfankui',isMenu:true },
          },
           {
            path:'/supplierManagement',
            name:'supplierManagement',
            component:()=>import("../views/chain/SupplierManagement.vue"),
            meta: { title: "供应商管理",icon:'yijianfankui' ,isMenu:true},
          },
          {
            path:'/logisticsTracking',
            name:'logisticsTracking',
            component:()=>import("../views/chain/LogisticsTracking.vue"),
            meta: { title: "物流跟踪",icon:'yijianfankui' ,isMenu:true},
          },
          
        ]
      }
]