import axios from 'axios';

let request = axios.create({
  //基础路径 - 留空，让API请求路径中包含/api前缀
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000, //超时
  withCredentials: true, // 允许携带凭证
});

//第二步：request实例添加请求
request.interceptors.request.use((config) => {
  const token = localStorage.getItem("TOKEN");
  if (token) {
    config.headers['token'] = token;
  }

  // 添加时间戳，防止GET请求缓存
  if (config.method?.toUpperCase() === 'GET') {
    config.params = { ...config.params, t: new Date().getTime() }
  }

  return config
})

//第三步：响应拦截器
request.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  if (error.response) {
    // 如果后端返回了数据，尝试从data中提取message
    if (error.response.data && error.response.data.msg) {
      error.message = error.response.data.msg;
    }
    // 对于状态码错误，仍然可以保留
    else {
      let status = error.response.status;
      switch (status) {
        case 400: error.message = "请求错误"; break;
        case 401: error.message = "TOKEN过期"; break;
        case 403: error.message = "无权访问"; break;
        case 404: error.message = "请求地址错误"; break;
        case 500: error.message = "服务器出现问题"; break;
        default: error.message = "网络出现问题";
      }
    }
  } else {
    error.message = '网络连接失败，请检查网络设置';
  }

  return Promise.reject(error);
});

export default request;