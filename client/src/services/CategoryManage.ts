import request from '@/utils/request'

// 获取列表
export async function getCategoryList<T>(data: T) {
  return request('/api/category/list', {
    method: 'GET',
    data
  })
}

// 新增
export async function addCategory<T>(data: T) {
  return request('/api/category/add', {
    method: 'POST',
    data
  })
}

// 删除
export async function deleteCategory<T>(data: T) {
  return request('/api/category/delete', {
    method: 'POST',
    data
  })
}

// 更新
export async function updateCategory<T>(data: T) {
  return request('/api/category/update', {
    method: 'POST',
    data
  })
}
