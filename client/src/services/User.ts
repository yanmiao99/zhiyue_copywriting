import request from '@/utils/request'

// 登陆
export async function login(data: any) {
  return request('/api/user/login', {
    method: 'POST',
    data
  })
}

// 获取用户信息
export async function getUserInfo() {
  return request('/api/user/current', {
    method: 'GET'
  })
}

// 获取验证码
export async function getCaptcha(data: any, headers: any) {
  return request('/admin/v1/fastlogincode', {
    method: 'POST',
    data,
    headers
  })
}

// 验证码登录

export async function captchaLogin(data: any, headers: any) {
  return request('/admin/v1/fastlogin', {
    method: 'POST',
    data,
    headers
  })
}

// 获取 oss 签名
export async function getSign(data: any) {
  return request('/portal/v1/getsign', {
    method: 'POST',
    data
  })
}

// 忘记密码验证码
export async function getForgetPasswordCode(data: any, headers: any) {
  return request('/admin/v1/resetpwdcode', {
    method: 'POST',
    data,
    headers
  })
}

// 重置密码
export async function resetPassword(data: any, headers: any) {
  return request('/admin/v1/resetpwd', {
    method: 'POST',
    data,
    headers
  })
}

// 微信登陆
export async function weChatLogin() {
  return request('/admin/v1/wxlogin/getparam', {
    method: 'GET'
  })
}

// 微信登陆轮询接口
export async function weChatLoginPolling(params: any) {
  return request('/account/v1/wxcallback', {
    method: 'GET',
    params
  })
}
