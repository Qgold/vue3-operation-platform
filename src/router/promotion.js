import Layout from "../components/Layout.vue";
import permission from "../directives/permission";
export const promotionRoutes = [
 {
    path:'/promotion',
    name:'promotion',
    component:Layout,
    meta: { title: "营销与活动管理",icon:'ce-shujufuwuicon' ,isMenu:true,permission:'promotion' },
    children:[
      {
        path:'/activityManager',
        name:'activityManager',
        component:()=>import("../views/promotion/ActivityManager.vue"),
        meta: { title: "活动配置",icon:'yijianfankui',isMenu:true ,permission:'promotion:activityManager'},
      },
       {
        path:'/channelManagement',
        name:'channelManagement',
        component:()=>import("../views/promotion/ChannelManagement.vue"),
        meta: { title: "渠道管理",icon:'yijianfankui' ,isMenu:true,permission:'promotion:channelManagement' },
      },
      {
        path:'/userReach',
        name:'userReach',
        component:()=>import("../views/promotion/UserReach.vue"),
        meta: { title: "用户触达",icon:'yijianfankui',isMenu:true,permission:'promotion:userReach'  },
      },
      
    ]
  } 
]