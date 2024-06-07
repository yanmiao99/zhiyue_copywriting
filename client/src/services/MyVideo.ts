import request from '@/utils/request'

// 获取列表
export async function getVideoList<T>(data: T) {
  return request('/portal/video/v1/list', {
    method: 'POST',
    data
  })
}


// 暂存视频为草稿
export async function stagingVideoDraft<T>(data: T) {
  return request('/portal/video/v1/draft', {
    method: 'POST',
    data
  })
}

// 提交审核
export async function submitVideoAudit<T>(data: T) {
  return request('/portal/video/v1/upsert', {
    method: 'POST',
    data
  })
}

// 删除视频
export async function deleteVideo<T>(data: T) {
  return request('/portal/video/v1/delete', {
    method: 'POST',
    data
  })
}

