// 全局共享数据示例
import { DEFAULT_NAME, UPLOAD_URL, BASE_COLOR, DEFAULT_LOGO, ICON_FONT_URL } from '@/constants'
import { useState } from 'react'
import { login, getUserInfo } from '@/services/UserManage'
import { getAccessToken } from '@/utils/utils'

export default () => {
  const [defaultName, setDefaultNameName] = useState<string>(DEFAULT_NAME!)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [routerList, setRouterList] = useState<any>()
  const [userInfo, setUserInfo] = useState<any>({})
  const [authList, setAuthList] = useState<any>([]) // 身份列表
  const [contentWidth, setContentWidth] = useState<number>(800)

  // 登陆
  const Login = async (data: any) => {
    return login(data)
  }

  // 获取用户信息
  const GetUserInfo = async () => {
    return getUserInfo()
  }

  // 检查用户是否登陆
  const CheckUser = () => {
    return new Promise((resolve, reject) => {
      const token = getAccessToken()
      if (token) {
        resolve(true)
      } else {
        reject(false)
      }
    })
  }

  return {
    defaultName,
    setDefaultNameName,
    isLoading,
    setIsLoading,
    routerList,
    setRouterList,
    userInfo,
    setUserInfo,
    contentWidth,
    setContentWidth,
    authList,
    setAuthList,

    // 全局常量
    UPLOAD_URL,
    BASE_COLOR,
    DEFAULT_LOGO,
    ICON_FONT_URL,

    Login,
    GetUserInfo,
    CheckUser
  }
}
