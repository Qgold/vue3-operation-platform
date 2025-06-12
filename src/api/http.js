import axios from 'axios';
import { useRouter } from 'vue-router' // 导入 useRouter
import { ElMessage } from 'element-plus'
import {useAppStore} from '@/store/app'
const router = useRouter()
// 创建 Axios 实例
const http = axios.create({
  baseURL: import.meta.env.VUE_APP_BASE_API || '/api', // 基础 URL
  timeout: 120000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 在请求发送前处理逻辑，例如添加 token
    const store = useAppStore(); // Assuming your store is named AuthStore
    const token = store.token; // Get token from store
    if (token) {
      config.headers.Authorization = `Bearer ${'sk-64725abb385b426795d23cb0a66f7963'}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    // 对响应数据进行处理
    return response.data;
  },
  error => {
    // 处理错误响应
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页面
         
          router.push('/login');
          break;
        case 403:
          // 权限不足
        
          ElMessage.error('权限不足')
          break;
        default:
          console.error('服务器错误');
      }
    }
    return Promise.reject(error);
  }
);

export default http;