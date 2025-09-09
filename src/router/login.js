import permission from "../directives/permission";

export const loginRoutes = [
  {
    path: "/login",
    name: "login",
    component: ()=>import("../views/Login.vue"),
    meta: { title: "登录", isMenu: false ,permission:'login' },
    whiteUser: true,
  },

  {
    path: "/register",
    name: "register",
    component: ()=>import("../views/Register.vue"),
    meta: { title: "注册" ,isMenu: false,permission:'register' },
    whiteUser: true,
  }
]
