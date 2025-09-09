import { KeepAlive } from "vue";
import Layout from "../components/Layout.vue";
import permission from "../directives/permission";
export const exampleRoutes = [
      {
        path:'/example',
        name:'example',
        component:Layout,
        meta: { title: "页面示例",icon:'ce-shujufuwuicon',isMenu:true ,permission:'example'},
        children:[
          {
            path:'/result',
            name:'result',
            component:()=>import("../views/example/Result.vue"),
            meta: { title: "结果页",icon:'yijianfankui',isMenu:true ,permission:'example:result' },
          },
           {
            path:'/list',
            name:'list',
            component:()=>import("../views/example/Cockpit.vue"),
            meta: { title: "列表",icon:'yijianfankui' ,isMenu:true,permission:'example:list' },
          },
          {
            path:'/groupForm',
            name:'groupForm',
            component:()=>import("../views/example/GroupForm.vue"),
            meta: { title: "分组表单",icon:'yijianfankui' ,isMenu:true,permission:'example:groupForm' },
          },
          {
            path:'/componetEax',
            name:'componetEax',
            component:()=>import("../views/example/ComponentGroup.vue"),
            meta: { title: "组件示例",icon:'yijianfankui' ,isMenu:true,keepAlive:true,permission:'example:componetEax' },
          },
          
        ]
      }
]