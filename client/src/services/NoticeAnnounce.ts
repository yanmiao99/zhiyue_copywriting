import request from '@/utils/request'

// 获取列表
export async function getAnnouncementList<T>(data: T) {
  return request('/admin/v1/announcement/list', {
    method: 'POST',
    data
  })
}

// 封禁/解封
export async function deleteAnnouncementItem<T>(id: T) {
  return request(`/admin/v1/announcement/${id}`, {
    method: 'DELETE'
  })
}

// 新增/编辑账号
export async function addAndEditAnnouncement<T>(data: T) {
  return request('/admin/v1/announcement/upsert', {
    method: 'POST',
    data
  })
}

// 编辑账号
export async function checkAnnouncementDetails<T>(id: T) {
  return request(`/admin/v1/announcement/${id}`, {
    method: 'GET'
  })
}

// 发送公告
export async function sendAnnouncementNotify<T>(data: T) {
  return request('/admin/v1/announcement/notify', {
    method: 'POST',
    data
  })
}
