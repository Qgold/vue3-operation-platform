// stores/permission.js
import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    // 当前用户权限列表（实际项目中从接口获取）
    permissions: ['user:add', 'user:edit']
  }),
  actions: {
    // 检查是否拥有权限
    hasPermission(permission) {
      return this.permissions.includes(permission)
    },
    // 更新权限（登录后调用）
    setPermissions(permissions) {
      this.permissions = permissions
    }
  }
})