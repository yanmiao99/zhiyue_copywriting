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
export async function getUserList(data: any) {
  return request('/api/user/list', {
    method: 'GET',
    data
  })
}

// 删除用户
export async function deleteUser(data: any) {
  return request(`/api/user/delete`, {
    method: 'POST',
    data
  })
}

// 新增用户
export async function registerUser(data: any) {
  return request('/api/user/register', {
    method: 'POST',
    data
  })
}

// 更新用户
export async function updateUser(data: any) {
  return request('/api/user/updateUserInfo', {
    method: 'POST',
    data
  })
}
