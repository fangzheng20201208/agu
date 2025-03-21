import axios from 'axios';

// 定义基础 URL
const BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络连接');
    }
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// API 方法
export const api = {
  // 登录相关
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  
  // 用户管理相关
  getUsers: () => axiosInstance.get('/users'),
  updateUser: (id, data) => axiosInstance.put(`/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
  
  // 商品相关
  getProducts: () => axiosInstance.get('/products'),
  getProduct: (id) => axiosInstance.get(`/products/${id}`),
  createProduct: (formData) => axiosInstance.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    transformRequest: [(data) => data],
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log('Upload progress:', percentCompleted + '%');
    }
  }),
  updateProduct: (id, data) => axiosInstance.put(`/products/${id}`, data),
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),

  // 单独的图片上传方法
  uploadImage: (formData) => axiosInstance.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),
};

export default api; 