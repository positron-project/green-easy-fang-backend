import { createApp } from 'vue'
import App from './App.vue'
//安装 Element Plus 和自动引入插件
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
//引入路由
import router from './router'
import pinia from './store'

//引入全局样式
import '@/styles/index.scss'

// 创建应用实例并保存到变量
const app = createApp(App)

//先注册所有插件
app.use(router)
app.use(pinia)
app.use(ElementPlus)

//然后再挂载到DOM元素
app.mount('#app')