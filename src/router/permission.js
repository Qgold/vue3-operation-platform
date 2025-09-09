import Layout from "../components/Layout.vue";  

export const permissionRoutes = [{
    name:  "permission",
    path: "/permission",
    meta: { title: "用户权限",icon:'ce-quanxianguanliicon1'  ,isMenu:true ,permission:'permission'},
    component: Layout,
    children: [{
      path: "/user",
      name: "user",
      component: ()=>import("../views/User.vue"),
      meta: { title: "用户列表" ,isMenu:true,permission:'permission:user' },
    },
    {
      path: "/role",
      name: "role",
      component: ()=>import("../views/Role.vue"),
      meta: { title: "角色列表" ,isMenu:true ,permission:'permission:role'  },
    },
    {
      path:'/user-permission',
      name: "userPermission",
      component: ()=>import("../views/Role.vue"),
      meta: { title: "用户权限" ,isMenu:false ,permission:'permission:userPermission'  },
    }]
}]