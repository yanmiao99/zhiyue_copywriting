import { useModel, history } from '@umijs/max'
import { useEffect, useState } from 'react'
import { PageLoading } from '@ant-design/pro-components'
import BasicLayout from '../BasicLayout'
import { clearCookie, getUserInfo, routeFormat } from '@/utils/utils'

import manageRoutes from '@config/manageRoutes'
import { notification } from 'antd'

const SecurityLayout = () => {
  const { routerList, setRouterList, setUserInfo, CheckUser } = useModel('Global')
  const [isLogin, setIsLogin] = useState(false)
  const [userMenu, setUserMenu] = useState([]) // 用户菜单

  const { GetMenuList } = useModel('MenuManage')

  // 判断是否有权限登录
  const isAuth = platform => {
    if (platform === 'server' || platform === 'all') {
      return true
    } else {
      return false
    }
  }

  // 获取用户信息
  const fetchUser = async () => {
    try {
      console.log('getUserInfo()========', getUserInfo())

      const { username, id, platform } = getUserInfo()

      const userRouterRes = await GetMenuList()
      setUserMenu(userRouterRes.list)

      // 判断用户身份是否已经初始化
      if (isAuth()) {
        notification.warning({
          message: '身份异常',
          description: '登录账号暂无权限, 请联系管理员'
        })
        goLogin()
        return
      }

      setUserInfo({
        username,
        uid: id
      })

      setIsLogin(true)

      // 动态生成路由菜单
      let resRouter = routeFormat(userRouterRes.list)
      setRouterList(resRouter)
    } catch (error) {
      console.log('error========', error)
      goLogin()
    }
  }

  // 检查用户是否登录
  const checkUser = () => {
    CheckUser()
      .then(res => {
        if (res) {
          fetchUser()
        } else {
          goLogin()
        }
      })
      .catch(err => {
        goLogin()
      })
  }

  // 跳转到登录页
  const goLogin = () => {
    clearCookie()
    const path = window.location.pathname
    let target = ''
    if (path === '/main/login') {
      target = '/main/login'
    } else {
      target = `/main/login?target=${path}`
    }
    history.push(target)
  }

  // 判断路由权限
  const checkRole = () => {
    try {
      const { platform } = getUserInfo()
      const { pathname } = location
      if (pathname === '/manage' || pathname === '/manage/welcome') {
        // history.push('./welcome')
      } else {
        let isExistence = manageRoutes.some(item => item.path === pathname)
        isExistence || history.push('/manage/404')
      }
    } catch (error) {
      goLogin()
    }
  }

  useEffect(() => {
    checkRole()
  }, [location.pathname])

  useEffect(() => {
    checkUser()
  }, [])

  return isLogin ? <BasicLayout authRoute={routerList} /> : <PageLoading />
}

export default SecurityLayout
