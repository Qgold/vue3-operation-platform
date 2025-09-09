import Layout from "../components/Layout.vue";
import permission from "../directives/permission";
export const technologyRoutes = [
     {
        path: "/tec",
        name:'technology',
        meta: { title: "技能",icon:'ce-jijingongjuicon1',isMenu:true ,permission:'technology'},
        component: Layout,
        children: [
          {
          path: "/webAssembly",
          name: "webAssembly",
          component: ()=>import("../views/WebAssembly.vue"),
          meta: { title: "WebAssemly相关",isMenu:true,permission:'technology:webAssembly' },
        },
         {
          path: "/3d",
          name: "3d",
          component: ()=>import("../views/ThreeD.vue"),
          meta: { title: "3D软件相关",isMenu:true,permission:'technology:3d'  },
        },
        {
          path: "/react",
          name: "react",
          component: ()=>import("../views/ReactPage.vue"),
          meta: { title: "React相关" ,isMenu:true,permission:'technology:react'  },
        },
        {
          path: "/node",
          name: "node",
          component: ()=>import("../views/NodePage.vue"),
          meta: { title: "Node相关",isMenu:true ,permission:'technology:node'  },
        },
        {
          path: "/vue",
          name: "vue",
          component: ()=>import("../views/VuePage.vue"),
          meta: { title: "Vue相关" ,isMenu:true,permission:'technology:vue'  },
        },
        {
          path: "/htmlcssjs",
          name: "htmlcssjs",
          component: ()=>import("../views/VuePage.vue"),
          meta: { title: "前端基础知识",isMenu:true ,permission:'technology:htmlcssjs'  },
        },
        {
          path: "/browser",
          name: "browser",
          component: ()=>import("../views/Browser.vue"),
          meta: { title: "浏览器相关" ,isMenu:true,permission:'technology:browser'},
        }
      ],
        
      }
]