import request from '@/utils/request'

// 获取签名
export async function getWxSign<T>(data: T) {
  return request('/account/v1/wxsign', {
    method: 'POST',
    data
  })
}

// 获取笔记详情
export async function getNoteDetail<T>(noteId: T) {
  return request(`/note/v1/${noteId}`, {
    method: 'GET'
  })
}

// 获取视频详情
export async function getVideoDetail<T>(videoId: T) {
  return request(`/frontvideo/v1/${videoId}`, {
    method: 'GET'
  })
}
