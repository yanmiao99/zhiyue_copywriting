import request from '@/utils/request'

// 创建订单
export async function createOrder(data: any, headers: any) {
  return request('/portal/recharge/v1/create', {
    method: 'POST',
    data,
    headers
  })
}

// 查询订单支付状态
export async function queryOrderPayStatus(data: any, headers: any) {
  return request('/portal/recharge/v1/query', {
    method: 'POST',
    data,
    headers
  })
}

// 查询用户星币余额
export async function checkUserBalance(data: any, headers: any) {
  return request('/portal/recharge/v1/balance', {
    method: 'POST',
    data,
    headers
  })
}
