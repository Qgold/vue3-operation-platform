import http from './http'

// 获取所有业务规则配置
export const getBusinessRules = () => {
  return http.get('/api/business/rules')
}

// 更新业务规则配置
export const updateBusinessRules = (data) => {
  return http.post('/api/business/rules', data)
}

// 重置业务规则配置
export const resetBusinessRules = () => {
  return http.post('/api/business/rules/reset')
}

// 获取商品列表
export const getProducts = () => {
  return http.get('/api/products')
}

// 获取商品分类
export const getCategories = () => {
  return http.get('/api/categories')
}

// 获取配送区域
export const getRegions = () => {
  return http.get('/api/regions')
}

// 获取业务配置
export const getBusinessConfig = () => {
  return http.get('/api/business/config')
}

// 保存业务配置
export const saveBusinessConfig = (config) => {
  return http.post('/api/business/config', config)
}
