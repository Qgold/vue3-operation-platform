import Layout from "../components/Layout.vue";  
export const dashboardRoutes = [
      {
        path:'/dashboard',
        name:'dashboard',
        component:Layout,
        meta: { title: "数据看板与分析",icon:'ce-shujufuwuicon',isMenu:true },
        children:[
          {
            path:'/dataMonitoring',
            name:'dataMonitoring',
            component:()=>import("../views/DataMonitor.vue"),
            meta: { title: "实时数据监控",icon:'yijianfankui',isMenu:true },
          },
           {
            path:'/customerExcel',
            name:'customerExcel',
            component:()=>import("../views/CustomerExcel.vue"),
            meta: { title: "自定义报表",icon:'yijianfankui',isMenu:true },
          },
          {
            path:'/trendAnalysis',
            name:'trendAnalysis',
            component:()=>import("../views/TrendAnalysis.vue"),
            meta: { title: "​趋势分析",icon:'yijianfankui',isMenu:true },
          },
          {
            path:'/warningMechanism',
            name:'warningMechanism',
            component:()=>import("../views/WarningMechanism.vue"),
            meta: { title: "预警机制",icon:'yijianfankui',isMenu:true },
          }
        ]
      }
]