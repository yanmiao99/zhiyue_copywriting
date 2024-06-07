import request from '@/utils/request'

// 获取列表
export async function getVideoList<T>(data: T) {
  return request('/admin/v1/video/list', {
    method: 'POST',
    data
  })
}

// 封禁/解封
export async function changeVideoStatus<T>(data: T) {
  return request(`/admin/v1/video/status`, {
    method: 'PUT',
    data
  })
}

// 查看单条视频详情
export async function getItemVideoDetails<T>(videoId: T) {
  return request(`/admin/v1/video/${videoId}`, {
    method: 'GET'
  })
}
