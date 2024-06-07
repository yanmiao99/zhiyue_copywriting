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

// 获取用户列表
export async function getUserList(params: any) {
  return request('/api/user/list', {
    method: 'GET',
    params
  })
}
