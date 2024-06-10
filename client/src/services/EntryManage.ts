import request from '@/utils/request'

// 获取列表
export async function getCategoryDetailsList<T>(data: T) {
  return request('/api/categoryDetails/list', {
    method: 'GET',
    data
  })
}

// 新增
export async function addCategoryDetails<T>(data: T) {
  return request('/api/categoryDetails/add', {
    method: 'POST',
    data
  })
}

// 删除
export async function deleteCategoryDetails<T>(data: T) {
  return request('/api/categoryDetails/delete', {
    method: 'POST',
    data
  })
}

// 更新
export async function updateCategoryDetails<T>(data: T) {
  return request('/api/categoryDetails/update', {
    method: 'POST',
    data
  })
}
