import request from '@/utils/request'

// 数据统计通用查询
export async function dataCommonQuery(data: any) {
  return request('/admin/static/common/query', {
    method: 'POST',
    data
  })
}

// 支付 top5 (老师)
export async function payTop(params: any) {
  return request('/portal/static/pay/top', {
    method: 'GET',
    params
  })
}

// 销售Top5课程 (老师)
export async function courseTop(params: any) {
  return request('/portal/static/course/top', {
    method: 'GET',
    params
  })
}

// 课程数据 (老师)
export async function courseDetail(params: any) {
  return request('/portal/static/course/detail', {
    method: 'GET',
    params
  })
}

// 面板数据 (老师)
export async function orderPanel(params: any) {
  return request('/portal/static/order/panel', {
    method: 'GET',
    params
  })
}
