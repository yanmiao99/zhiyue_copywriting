// @ts-ignore
import CryptoJS from 'crypto-js'

// 加密密码
export const encryptPassword = (password?: string) => {
  let currentPassword
  if (password) {
    currentPassword = CryptoJS.SHA1(`${password}57sx%#*s13*`).toString()
  } else {
    currentPassword = CryptoJS.SHA1(`57sx%#*s13*`).toString()
  }
  return currentPassword
}

// 解密密码 @param data ()
export const requestEncryption = (data: any) => {
  let body = data
  const timestamp = Math.floor(Date.now() / 1000)

  // 时间戳
  const iv = CryptoJS.enc.Hex.parse('cd1e592d089d701580d9b27e729529fb')
  const key = CryptoJS.enc.Hex.parse(CryptoJS.MD5(`${timestamp}iutr%$#a36yuh#qo`).toString())

  // sha1转码
  if (body.password) {
    body.password = CryptoJS.SHA1(`${body.password}57sx%#*s13*`).toString()
  }

  let headers = {
    'Content-Type': 'application/octet-stream',
    timestamp: timestamp + '',
    signature: CryptoJS.MD5(JSON.stringify(body) + 'xiuy45*@#rtavbfr').toString()
  }

  // 给body对象加密
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(body), key, {
    iv: iv,
    padding: CryptoJS.pad.ZeroPadding,
    mode: CryptoJS.mode.CBC
  })

  // 获取加密后的字节数组
  let decrypted = encrypted.ciphertext
  const result = new Uint8Array(decrypted.words.length * 4)
  for (let i = 0; i < decrypted.words.length; i++) {
    result[i * 4] = (decrypted.words[i] >> 24) & 0xff
    result[i * 4 + 1] = (decrypted.words[i] >> 16) & 0xff
    result[i * 4 + 2] = (decrypted.words[i] >> 8) & 0xff
    result[i * 4 + 3] = decrypted.words[i] & 0xff
  }
  // 把字节数组转为16进制
  const hexString = Array.from(result, byte => byte.toString(16).padStart(2, '0')).join('')
  // @ts-ignore  将十六进制字符串转换为二进制数据
  const binaryData = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))).buffer
  let blob = new Blob([binaryData], { type: 'application/octet-stream' })

  return {
    blob,
    headers
  }
}

export function trim(str: string) {
  return str.trim()
}

export const getUnique = (num?: number) => {
  const res = Math.random().toString().split('.')[1]
  if (num) {
    return res.slice(0, num)
  } else {
    return res
  }
}

export function createCookie(
  name: string,
  value: string,
  days?: number,
  path?: string,
  domain?: string,
  secure?: string
) {
  let expires = ''
  if (days) {
    let date = new Date()

    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)

    expires = date.toUTCString()
  } else expires = ''

  let cookieString = name + '=' + trim(value)

  if (expires) cookieString += ';expires=' + expires

  if (path) cookieString += ';path=' + trim(path)

  if (domain) cookieString += ';domain=' + trim(domain)

  if (secure) cookieString += ';secure=' + trim(secure)

  document.cookie = cookieString
}

// 用户信息
export function getUserInfo() {
  const key = 'userinfo'
  let store = sessionStorage.getItem(key) || localStorage.getItem(key)
  return store ? JSON.parse(store) : null
}

export function setUserInfo(value: string) {
  const key = 'userinfo'
  sessionStorage.setItem(key, JSON.stringify(value))
  localStorage.setItem(key, JSON.stringify(value))
}

export function getAccessToken() {
  const key = 'token'
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return sessionStorage.getItem(key) || localStorage.getItem(key) || getCookie(key)
}

export function setAccessToken(value: string, lasting: boolean) {
  const key = 'token'
  sessionStorage.setItem(key, value)
  localStorage.setItem(key, value)
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  setCookie(key, value, getDomain(), lasting)
}

export function clearAccessToken() {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  clearStorage()
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const domain = getDomain()
  const key = 'token'
  document.cookie = key + '=0;expires=' + new Date(0).toUTCString()
  document.cookie = key + '=0;domain=' + domain + ';expires=' + new Date(0).toUTCString()
  document.cookie = key + '=0;path=/;domain=' + domain + ';expires=' + new Date(0).toUTCString()
}

export function getCookie(name: string) {
  const cookies = document.cookie
  if (cookies) {
    const cookieObj: any = {}
    cookies.split(';').forEach(item => {
      const [key, value] = item.split('=')
      cookieObj[trim(key)] = trim(value)
    })

    if (cookieObj[name]) {
      return cookieObj[name]
    } else {
      return ''
    }
  } else {
    return ''
  }
}

export function CheckOptionAuth(routeList: any[], authList: string[]) {
  const resList: any[] = []
  routeList.forEach(route => {
    if (!route.auth || authList.includes(route.auth)) {
      const routeItem = { ...route }
      if (route.routes && route.routes.length) {
        routeItem.routes = CheckOptionAuth(route.routes, authList)
      }

      resList.push(routeItem)
    }
  })

  return resList
}

export function findPath(path: string, routes: any[], authList: string[]): any {
  let res = null

  routes.forEach(item => {
    if (item.path === path) {
      res = item
    } else {
      if (item.routes) {
        const tempRes = findPath(path, item.routes, authList)
        if (tempRes) {
          res = tempRes
        }
      }
    }
  })

  return res
}

export function findPathAuth(path: string, routes: any[], authList: string[]) {
  const res = findPath(path, routes, authList)
  if (!res.auth || authList.includes(res.auth)) {
    return true
  } else {
    return false
  }
}

export const changeFavicon = (faviconUrl: string) => {
  const eleList = Array.from(document.head.children)

  const favLink: any = eleList.find((item: any) => item.rel === 'shortcut icon')
  if (favLink) {
    favLink.href = faviconUrl
  }
}

export const getDomain = () => {
  let domain = window.location.hostname
  const domainList = window.location.hostname.split('.')
  if (domainList.length > 2) {
    domain = domainList.splice(1).join('.')
  }
  return domain
}

export const clearCookie = () => {
  const oKeys = document.cookie.match(/[^=;]+(?==)/g)
  const keys = oKeys ? oKeys.map(i => trim(i)) : []
  if (keys) {
    const domain = getDomain()
    keys.forEach(key => {
      document.cookie = key + '=0;expires=' + new Date(0).toUTCString()
      document.cookie = key + '=0;domain=' + domain + ';expires=' + new Date(0).toUTCString()
      document.cookie = key + '=0;path=/;domain=' + domain + ';expires=' + new Date(0).toUTCString()
    })
  }
}

export const clearStorage = () => {
  localStorage.clear()
  sessionStorage.clear()
}

export const clearLogin = () => {
  clearStorage()
  clearCookie()
}

export const getSortType = (sortType: string) => {
  const map: any = {
    ascend: 'asc',
    descend: 'desc'
  }
  return map[sortType]
}

export const isDot = (num: number) => {
  return String(num).indexOf('.') > -1
}

export const setQueryParams = (params: any) => {
  if (params) {
    const list = Object.keys(params).filter(item => params[item])
    if (list && list.length) {
      let str = '?'
      list.forEach((item, index) => {
        str += `${index ? '&' : ''}${item}=${params[item]}`
      })
      return str
    }
  }
  return ''
}

export const routeFormat = (list: any) => {
  return list.map((item: any) => ({
    name: item.menu_name,
    path: item.path === '#' ? `/${Math.floor(Math.random() * 1000000000)}` : item.path,
    component: './UserSum',
    icon: item.menu_icon,
    routes: item.children ? routeFormat(item.children) : null,
    id: item.id,
    pid: item.menu_pid,
    auth: item.auth
  }))
}

export const setCookie = (name: string, value: string, domain: string, keep?: boolean) => {
  let cookie_string = name + '=' + value

  if (keep) {
    const now = new Date()
    now.setFullYear(now.getFullYear() + 1)
    const expires = now.toUTCString()

    cookie_string += '; expires=' + expires
  }

  cookie_string += '; path=/'

  if (domain) cookie_string += '; domain=' + domain
  document.cookie = cookie_string
}
