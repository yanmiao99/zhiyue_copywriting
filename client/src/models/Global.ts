// 全局共享数据示例
import { DEFAULT_NAME, UPLOAD_URL, BASE_COLOR, UPLOAD_URL_FILE } from '@/constants'
import { useState } from 'react'
import {
  getCaptcha,
  login,
  captchaLogin,
  getSign,
  getForgetPasswordCode,
  resetPassword,
  weChatLogin,
  weChatLoginPolling,
  getUserInfo
} from '@/services/User'
import { getAccessToken, requestEncryption } from '@/utils/utils'

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

  // 获取验证码
  const GetCaptcha = async (data: any) => {
    let { blob, headers } = requestEncryption(data)
    return getCaptcha(blob, headers)
  }

  // 验证码登录
  const CaptchaLogin = async (data: any) => {
    let { blob, headers } = requestEncryption(data)
    return captchaLogin(blob, headers)
  }

  // 忘记密码验证码
  const GetForgetCaptcha = async (data: any) => {
    let { blob, headers } = requestEncryption(data)
    return getForgetPasswordCode(blob, headers)
  }

  // 重置密码
  const ResetPassword = async (data: any) => {
    let { blob, headers } = requestEncryption(data)
    return resetPassword(blob, headers)
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

  // 微信登陆
  const WeChatLogin = () => {
    return weChatLogin()
  }

  // 微信登陆轮询
  const WeChatLoginPolling = (params: any) => {
    return weChatLoginPolling(params)
  }

  // 获取 oss 签名
  const GetSign = async (data: any) => {
    return getSign({ subappid: 0, ...data })
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

    UPLOAD_URL,
    BASE_COLOR,
    UPLOAD_URL_FILE,

    Login,
    GetUserInfo,
    CheckUser,
    GetCaptcha,
    CaptchaLogin,
    GetSign,
    GetForgetCaptcha,
    ResetPassword,
    WeChatLogin,
    WeChatLoginPolling
  }
}
