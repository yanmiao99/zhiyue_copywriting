import request from '@/utils/request'

// 获取列表
export async function getTeacherList<T>(data: T) {
  return request('/admin/v1/teacher/list', {
    method: 'POST',
    data
  })
}

// 封禁/解封
export async function changeTeacherStatus<T>(data: T) {
  return request(`/admin/v1/teacher/status`, {
    method: 'PUT',
    data
  })
}

// 更改老师认证状态
export async function changeTeacherAuth<T>(data: T) {
  return request('/admin/v1/teacher/certstatus', {
    method: 'POST',
    data
  })
}

// 获取老师认证详情
export async function getTeacherAuthDetails<T>(data: T) {
  return request('/admin/v1/teacher/info', {
    method: 'POST',
    data
  })
}

// 获取老师收益详情
export async function getTeacherIncomeDetails<T>(data: T) {
  return request('/admin/v1/income/records', {
    method: 'POST',
    data
  })
}
