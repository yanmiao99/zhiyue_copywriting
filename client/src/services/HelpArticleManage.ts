import request from '@/utils/request'

// 获取列表
export async function getQAList<T>(data: T) {
  return request('/admin/v1/qa/list', {
    method: 'POST',
    data
  })
}

// 新增文章（编辑）
export async function addQA<T>(data: T) {
  return request('/admin/v1/qa', {
    method: 'PUT',
    data
  })
}

// 查看文章详情
export async function checkQADetail<T>(data: T) {
  return request('/admin/v1/qa', {
    method: 'POST',
    data
  })
}

// 删除文章
export async function deleteQA<T>(data: T) {
  return request('/admin/v1/qa', {
    method: 'DELETE',
    data
  })
}
