import request from '@/utils/request'

// 获取列表
export async function getReportList<T>(data: T) {
  return request('/admin/v1/report/list', {
    method: 'POST',
    data
  })
}

// 封禁/解封
export async function changeReportStatus<T>(data: T) {
  return request(`/admin/v1/report/status`, {
    method: 'PUT',
    data
  })
}

// 查看单条详情
export async function getItemReportDetails<T>(data: T) {
  return request(`/admin/v1/report/${data}`, {
    method: 'GET'
  })
}
