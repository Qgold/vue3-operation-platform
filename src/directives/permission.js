// directives/permission.js
import { usePermissionStore } from '../store/permission'

export default {
  mounted(el, binding) {
    const { value } = binding
    const permissionStore = usePermissionStore()
    
    if (value && typeof value === 'string') {
      // 检查单个权限
      if (!permissionStore.hasPermission(value)) {
        removeElement(el)
      }
    } else if (Array.isArray(value)) {
      // 检查多个权限（需满足所有权限）
      if (value.length > 0 && !value.every(p => permissionStore.hasPermission(p))) {
        removeElement(el)
      }
    } else if (value && typeof value === 'object') {
      // 高级模式：检查逻辑（AND/OR）
      const { permissions, logic = 'AND' } = value
      
      if (Array.isArray(permissions)) {
        const hasPermissions = permissions.map(p => permissionStore.hasPermission(p))
        const shouldShow = logic === 'AND' 
          ? hasPermissions.every(Boolean)
          : hasPermissions.some(Boolean)
        
        if (!shouldShow) {
          removeElement(el)
        }
      }
    } else {
      console.error(`无效的权限指令值: ${value}`)
    }
  }
}

// 移除元素（保留注释节点保持DOM结构稳定）
function removeElement(el) {
  if (el.parentNode) {
    const comment = document.createComment(' ')
    el.parentNode.replaceChild(comment, el)
  }
}