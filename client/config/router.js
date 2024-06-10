import manageRoutes from './manageRoutes'

export default [
  {
    path: '/',
    redirect: '/open/home'
  },
  {
    path: '/open',
    name: '开放平台',
    component: '@/layouts/OpenLayout',
    routes: [
      {
        name: '首页',
        path: '/open/home',
        component: '@/pages/Home/Home'
      }
    ]
  },
  {
    name: '仪表盘',
    path: '/manage',
    component: '@/layouts/SecurityLayout',
    routes: [
      { path: '/manage/*', component: '@/pages/404' },
      { path: '/manage/404', component: '@/pages/404' },
      {
        path: '/manage',
        redirect: '/manage/welcome'
      },
      {
        name: '欢迎',
        path: '/manage/welcome',
        component: './Welcome/Welcome'
      },
      ...manageRoutes
    ]
  },
  {
    path: '/main',
    name: '登录',
    component: '@/layouts/DoorLayout',
    routes: [
      {
        name: '登录',
        path: '/main/login',
        component: './Login/Login'
      }
    ]
  },
  { path: '/*', component: '@/pages/404' },
  { path: '/404', component: '@/pages/404' }
]
