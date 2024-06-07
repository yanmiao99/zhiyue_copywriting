import { notification } from '@/utils/AntdGlobal'
import { DEFAULT_NAME } from '@/constants'
import { history } from '@umijs/max'

// 处理请求的拦截器
export const request = {
  timeout: 30000,
  errorConfig: {},
  requestInterceptors: [
    // 设置请求头
    (url, options) => {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      }
      return {
        url,
        options: { ...options, headers }
      }
    }
  ],
  responseInterceptors: [
    response => {
      const { data: { code, data, msg } = {} } = response

      if (code === 200) {
        return Promise.resolve({
          data
        })
      } else if (code === 401) {
        const path = window.location.pathname
        const target = path ? `/main/login?target=${path}` : '/main/login'
        history.push(target)

        setTimeout(() => {
          notification?.error({
            message: '登录过期, 请重新登录',
            description: msg
          })
        }, 100)

        return Promise.reject('登录过期, 请重新登录')
      } else {
        notification?.error({
          message: `请求错误`,
          description: msg
        })
        return Promise.reject({
          code,
          msg
        })
      }
    }
  ]
}

// 动态添加 script
// const url = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
// const jsApi = document.createElement('script')
// jsApi.src = url
// document.head.appendChild(jsApi)

// 动态更改 title
document.title = DEFAULT_NAME
