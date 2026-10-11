import type { RouteRecordRaw } from 'vue-router';

export const constantRoute: RouteRecordRaw[] = [
  {
    //根路由
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/envContent',
    name: 'layout',
    meta: {
      title: '生态洞察',
      hidden: false,
      icon: "HomeFilled"
    },
    children: [
      {
        path: '/envContent',
        component: () => import('@/views/envContent/index.vue'),
        name: 'envContent',
        meta: {
          title: '生态洞察',
          hidden: false,
          icon: ""
        }
      },
      {
        path: '/exchangeGoods',
        component: () => import('@/views/exchangeGoods/index.vue'),
        name: 'exchangeGoods',
        meta: {
          title: '闲置绿洲',
          hidden: false,
          icon: ""
        }
      },
      {
        path: '/task',
        component: () => import('@/views/task/index.vue'),
        name: 'task',
        meta: {
          title: '绿色行动',
          hidden: false,
          icon: ""
        }
      },
      {
        path: '/forum',
        component: () => import('@/views/forum/index.vue'),
        name: 'forum',
        meta: {
          title: '环保圈',
          hidden: false,
          icon: ""
        }
      },
      {
        path: '/news',
        component: () => import('@/views/news/index.vue'),
        name: 'news',
        meta: {
          title: '消息中心',
          hidden: false,
          icon: ""
        }
      },
      {
        path: '/mine',
        component: () => import('@/views/mine/index.vue'),
        name: 'mine',
        meta: {
          title: '我的',
          hidden: false,
          icon: ""
        }
      },
      {
        path: '/envContent/successStoriesDetail/id=:id',
        name: 'successStoriesDetail',
        component: () => import('@/views/envContent/detail/index.vue'),
        props: true,
        meta: {
          hidden: true
        }
      },
      {
        path: '/envContent/carouselDetail/id=:id',
        name: 'carouselDetail',
        component: () => import('@/views/envContent/detail/index.vue'),
        props: true,
        meta: {
          hidden: true
        }
      },
      {
        // 正确的参数格式，使用冒号前缀
        path: '/envContent/spotNewMinImgDetail/id=:id',
        name: 'spotNewMinImgDetail',
        component: () => import('@/views/envContent/detail/index.vue'),
        props: true,
        meta: {
          hidden: true
        }
      },
      {
        path: '/envContent/spotNewMaxImgDetail/id=:id',
        name: 'spotNewMaxImgDetail',
        component: () => import('@/views/envContent/detail/index.vue'),
        props: true,
        meta: {
          hidden: true
        }
      },
      {
        path: '/forum/create',
        name: 'forumCreate',
        component: () => import('@/views/forum/moreCreative/creativeCenter/index.vue'),
        props: true,
        meta: {
          hidden: true
        }
      },
      {
        path: '/exchange/uploadGoods',
        name: 'uploadGoods',
        component: () => import('@/views/exchangeGoods/uploadGoods/index.vue'),
        props: true,
        meta: {
          hidden: true
        }
      },
      {
        path: '/exchange/detailGoods',
        name: 'detailGoods',
        component: () => import('@/views/exchangeGoods/detailGoods/index.vue'),
        props: true,
        meta: {
          hidden: true
        }
      },
    ]
  },
  {
    //404
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true
    }
  },
]