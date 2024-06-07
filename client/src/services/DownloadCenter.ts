import request from '@/utils/request'

// 获取下载信息
export async function getDownloadInfo<T>(platform: T) {
  return request(`/appfront/ota/v1/version?platform=${platform}`, {
    method: 'GET'
  })
}
