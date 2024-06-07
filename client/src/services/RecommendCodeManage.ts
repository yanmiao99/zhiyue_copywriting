import request from '@/utils/request'

// 获取列表
export async function getRewardsList<T>(data: T) {
  return request('/admin/static/inviterank/list', {
    method: 'POST',
    data
  })
}
