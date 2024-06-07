import request from '@/utils/request'

// 获取列表
export async function getPromotionList<T>(data: T) {
  return request('/admin/v1/promotion/list', {
    method: 'POST',
    data
  })
}

// 封禁/解封
export async function changePromotionStatus<T>(data: T) {
  return request(`/admin/v1/promotion/status`, {
    method: 'POST',
    data
  })
}

// 删除
export async function delPromotion<T>(data: T) {
  return request(`/admin/v1/promotion/del`, {
    method: 'POST',
    data
  })
}

// 创建/编辑
export async function addAndEditPromotion<T>(data: T) {
  return request('/admin/v1/promotion/upsert', {
    method: 'POST',
    data
  })
}

// 查看详情
export async function checkPromotionDetails<T>(id: T) {
  return request(`/admin/v1/promotion/${id}`, {
    method: 'GET'
  })
}

// 查看单条详情
export async function checkItemPromotionDetails<T>(id: T) {
  return request(`/admin/v1/promotdetail/${id}`, {
    method: 'GET'
  })
}
