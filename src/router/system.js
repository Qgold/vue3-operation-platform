import Layout from "../components/Layout.vue";
export const systemRoutes = [
    {
        path:'/system',
        name:'system',
        component:Layout,
        meta: { title: "系统设置",icon:'ce-yonghuguanliicon'  ,isMenu:true },
        children:[
           {
            path:'/chat',
            name:'chat',
            component:()=>import("../views/system/Chat.vue"),
            meta: { title: "AI回答",icon:'zhanghuguanli' ,isMenu:true  },
          },
           {
            path:'/orgStructure',
            name:'orgStructure',
            component:()=>import("../views/system/OrgStructure.vue"),
            meta: { title: "组织架构",icon:'zhanghuguanli' ,isMenu:true  },
          },
          {
            path:'/system/appointment',
            name:'appointment',
            component:()=>import("../views/system/Appointment.vue"),
            meta: { title: "会议预约",icon:'zhanghuguanli' ,isMenu:true  },
          },
          {
            path:'/system/detail',
            name:'detail',
            component:()=>import("../views/system/Feedback.vue"),
            meta: { title: "意见反馈",icon:'zhanghuguanli' ,isMenu:true  },
          },
          {
            path:'/system/record',
            name:'record',
            component:()=>import("../views/system/FeedbackRecord.vue"),
            meta: { title: "反馈记录",icon:'jiaoyiguanli' ,isMenu:false  },
          },
          {
            path:'/system/operateLog',
            name:'operateLog',
            component:()=>import("../views/system/OperateLog.vue"),
            meta: { title: "操作日志",icon:'gongmujijin'  ,isMenu:true },
          },
          {
            path:'/system/agreement',
            name:'agreement',
            component:()=>import("../views/system/Agreement.vue"),
            meta: { title: "协议列表",icon:'gongmujijin' ,isMenu:true  },
          }
        ]
      }
]