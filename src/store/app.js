import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useAppStore = defineStore('appStore', {
  // other options...
  state: () => ({
    counter: 0,
    token:'',
    userName:'',
    userInfo:{},
    rolePermissions:{},
    isCollapse:false,
    currentRoleId:'1',
    whiteList:['/login', '/register','/404'],
    currentRolePermissions: [] // 添加当前角色的权限列表
  }),
  getters: {
    // 自动将返回类型推断为数字
    doubleCount(state) {
      return state.counter * 2
    },
    // 返回类型必须明确设置
    doublePlusOne() {
      return this.counter * 2 + 1
    },
  },
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
        this.counter = Math.round(100 * Math.random())
    },
    setToken(token){
      this.token = token
      localStorage.setItem('token', token)
    },
    removeUserInfo(){
      this.token = ''
      this.userName = ''
      this.userInfo = {}
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
    },
    setUserName(userName){
      this.userName = userName
      localStorage.setItem('userName', userName)
    },
    setUserInfo(userInfo){
      this.userInfo = userInfo
    },
    saveRolePermissions(roleId, permissions) {
      console.log('保存角色权限', roleId, permissions)
      this.rolePermissions = {
        ...this.rolePermissions,
        [roleId]: permissions,
      }
      
      localStorage.setItem('rolePermissions', JSON.stringify(this.rolePermissions))
    },
    
    // 初始化权限数据
    initPermissions() {
      const storedPermissions = localStorage.getItem('rolePermissions')
      if (storedPermissions) {
        this.rolePermissions = JSON.parse(storedPermissions)
      }
    },

    // 设置当前角色的权限
    setCurrentRolePermissions(roleId) {
      this.currentRoleId = roleId
      this.currentRolePermissions = this.rolePermissions[roleId] || []
    },

    // 检查是否有某个权限
    hasPermission(path) {
      return this.currentRolePermissions.includes(path) || this.whiteList.includes(path)
    },
    setIsCollapse(isCollapse){
      this.isCollapse = isCollapse
      localStorage.setItem('isCollapse', isCollapse)
    }
  }
})