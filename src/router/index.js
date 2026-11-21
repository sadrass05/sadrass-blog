import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页 - 个人博客' }
  },
  {
    path: '/articles',
    name: 'ArticleList',
    component: () => import('../views/ArticleList.vue'),
    meta: { title: '文章列表 - 个人博客' }
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetail.vue'),
    meta: { title: '文章详情 - 个人博客' }
  },
  {
    path: '/diary',
    name: 'Diary',
    component: () => import('../views/Diary.vue'),
    meta: { title: '日记 - 个人博客' }
  },
  {
    path: '/projects',
    name: 'ProjectList',
    component: () => import('../views/ProjectList.vue'),
    meta: { title: '项目列表 - 个人博客' }
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: () => import('../views/ProjectDetail.vue'),
    meta: { title: '项目详情 - 个人博客' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { title: '关于我 - 个人博客' }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/AdminLogin.vue'),
    meta: { title: '管理员登录 - 个人博客' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: {
      title: '后台管理 - 个人博客',
      requiresAuth: true
    }
  },
  {
    path: '/admin/article/new',
    name: 'ArticleCreate',
    component: () => import('../views/ArticleEditor.vue'),
    meta: { 
      title: '新建文章 - 个人博客',
      requiresAuth: true 
    }
  },
  {
    path: '/admin/article/:id',
    name: 'ArticleEdit',
    component: () => import('../views/ArticleEditor.vue'),
    meta: { 
      title: '编辑文章 - 个人博客',
      requiresAuth: true 
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  if (to.meta.requiresAuth) {
    if (!userStore.token) {
      next('/admin/login')
      return
    }
    
    if (!userStore.isLoggedIn) {
      await userStore.fetchUser()
    }
    
    if (!userStore.isLoggedIn) {
      next('/admin/login')
      return
    }
  }
  
  next()
})

router.afterEach(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

export default router
