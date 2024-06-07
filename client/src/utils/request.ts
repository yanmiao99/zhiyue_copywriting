import { request } from '@umijs/max'
import { getAccessToken, getUserInfo } from './utils'

export default (url: string, config: any) => {
  const { method, data, params, headers } = config

  if (method === 'GET') {
    config.params = data || params
  }

  return request(url, {
    ...config,
    headers: {
      ...headers,
      token: getAccessToken(),
      userid: getUserInfo()?.userid || null
    }
  })
}
