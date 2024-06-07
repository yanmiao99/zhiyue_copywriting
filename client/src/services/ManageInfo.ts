import request from '@/utils/request'

// 获取列表
export async function getManageList<T>(data: T) {
  return request('/admin/v1/user/list', {
    method: 'POST',
    data
  })
}

// 封禁/解封
export async function changeManageStatus<T>(data: T) {
  return request(`/admin/v1/user/status`, {
    method: 'PUT',
    data
  })
}

// 创建账号
export async function createManageUser<T>(data: T) {
  return request('/admin/v1/user/create', {
    method: 'POST',
    data
  })
}

// 编辑账号
export async function updateManageUser<T>(data: T) {
  return request('/admin/v1/user/update', {
    method: 'POST',
    data
  })
}

