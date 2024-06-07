import request from '@/utils/request'

// 获取列表
export async function getCouponList<T>(data: T) {
  return request('/admin/v1/coupon/list', {
    method: 'POST',
    data
  })
}

// 封禁/解封
export async function changeCouponStatus<T>(data: T) {
  return request(`/admin/v1/coupon/status`, {
    method: 'PUT',
    data
  })
}

// 删除
export async function delCoupon<T>(activityId: T) {
  return request(`/admin/v1/coupon/${activityId}`, {
    method: 'DELETE'
  })
}

// 创建
export async function upsertCoupon<T>(data: T) {
  return request('/admin/v1/coupon/upsert', {
    method: 'POST',
    data
  })
}

// 查看详情
export async function checkCouponDetails<T>(activityId: T) {
  return request(`/admin/v1/coupon/${activityId}`, {
    method: 'GET'
  })
}
