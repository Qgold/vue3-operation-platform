export const loginRoutes = [
  {
    path: "/login",
    name: "login",
    component: ()=>import("../views/Login.vue"),
    meta: { title: "登录", isMenu: false },
    whiteUser: true,
  },

  {
    path: "/register",
    name: "register",
    component: ()=>import("../views/Register.vue"),
    meta: { title: "注册" ,isMenu: false },
    whiteUser: true,
  }
]
