import Layout from "../components/Layout.vue";  
export const permissionRoutes = [
      {
        name:  "permission",
        path: "/permission",
        meta: { title: "用户权限",icon:'ce-quanxianguanliicon1'  ,isMenu:true },
        component: Layout,
        children: [{
          path: "/user",
          name: "user",
          component: ()=>import("../views/User.vue"),
          meta: { title: "用户列表" ,isMenu:true  },
        },
        {
          path: "/role",
          name: "role",
          component: ()=>import("../views/Role.vue"),
          meta: { title: "角色列表" ,isMenu:true  },
        },
        {
          path:'/user-permission',
          name: "userPermission",
          component: ()=>import("../views/Role.vue"),
          meta: { title: "用户权限" ,isMenu:false  },
        
        }],
       
      }
]