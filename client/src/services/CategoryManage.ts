import request from '@/utils/request'

// 大类列表
export async function getCourseCategoryList<T>(data: T) {
  return request('/admin/v1/category/list', {
    method: 'POST',
    data
  })
}

// 小类列表
export async function getClassifyList<T>(data: T) {
  return request('/admin/v1/classify/list', {
    method: 'POST',
    data
  })
}

// 新增小类（编辑）
export async function addClassify<T>(data: T) {
  return request('/admin/v1/classify', {
    method: 'PUT',
    data
  })
}

// 新增大类（编辑）
export async function addCategory<T>(data: T) {
  return request('/admin/v1/category', {
    method: 'PUT',
    data
  })
}

// 删除大类
export async function deleteCategory<T>(data: T) {
  return request('/admin/v1/category', {
    method: 'DELETE',
    data
  })
}

// 删除小类
export async function deleteClassify<T>(data: T) {
  return request('/admin/v1/classify', {
    method: 'DELETE',
    data
  })
}

// 大类用途列表
export async function getUseasList<T>(data: T) {
  return request('/admin/v1/useas/list', {
    method: 'GET',
    data
  })
}
