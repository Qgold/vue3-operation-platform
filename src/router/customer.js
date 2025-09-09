import Layout from "../components/Layout.vue";
import permission from "../directives/permission";
export const customerRoutes = [
     {
        path:'/customer',
        name:'customer',
        component:Layout,
        meta: { title: "客户与服务管理",icon:'ce-shujufuwuicon',isMenu:true,permission:'customer' },
        children:[
          {
            path:'/crmIntegration',
            name:'crmIntegration',
            component:()=>import("../views/customer/CrmIntegration.vue"),
            meta: { title: "CRM集成",icon:'yijianfankui',isMenu:true ,permission:'customer:crmIntegration' },
          },
           {
            path:'/wordOrderSystem',
            name:'wordOrderSystem',
            component:()=>import("../views/customer/WordOrderSystem.vue"),
            meta: { title: "工单系统",icon:'yijianfankui',isMenu:true ,permission:'customer:wordOrderSystem' },
          }, 
        ]
      }
]