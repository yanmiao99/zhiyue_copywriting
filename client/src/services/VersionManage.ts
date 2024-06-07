import request from '@/utils/request'

// 获取列表
export async function getOTAVersionList<T>(data: T) {
  return request('/admin/v1/otaversion/list', {
    method: 'POST',
    data
  })
}

// 发布
export async function upsertOTAVersion<T>(data: T) {
  return request('/admin/v1/otaversion/upsert', {
    method: 'POST',
    data
  })
}
