import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routers'

let router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  // 滚动行为 - 优化页面切换时的滚动位置
  scrollBehavior(_to, _from, savedPosition) {
    // 如果有保存的位置，则滚动到该位置
    if (savedPosition) {
      return savedPosition
    } else {
      // 否则滚动到顶部
      return {
        left: 0,
        top: 0
      }
    }
  }
})

export default router