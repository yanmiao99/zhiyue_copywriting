import request from '@/utils/request'

// 获取列表
export async function getStudentList<T>(data: T) {
  return request('/admin/v1/student/list', {
    method: 'POST',
    data
  })
}

// 封禁/解封
export async function changeStudentStatus<T>(data: T) {
  return request(`/admin/v1/student/status`, {
    method: 'PUT',
    data
  })
}

// 获取老师/学生充值消费记录
export async function getRechargeDetail<T>(data: T) {
  return request('/admin/v1/starcurrency/records', {
    method: 'POST',
    data
  })
}

// 获取老师/学生金币记录
export async function getGoldDetail<T>(data: T) {
  return request('/admin/v1/gold/records', {
    method: 'POST',
    data
  })
}
