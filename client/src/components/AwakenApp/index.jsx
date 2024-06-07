import React, { useEffect, useRef } from 'react'
import { Button, App } from 'antd'
import wx from 'weixin-js-sdk'
// import vconsole from 'vconsole'
// new vconsole()
import { useModel } from '@umijs/max'
import './index.less'

const AwakenApp = ({ id, type, style, children = 'App内查看' }) => {
  const wxRef = useRef(null)
  const { GetWxSign } = useModel('H5Share')
  const { BASE_COLOR } = useModel('Global')
  const { message } = App.useApp()

  const extInfo = {
    id,
    type
  }

  // 判断当前是否是微信浏览器
  const isWeChat = () => {
    const ua = navigator.userAgent.toLowerCase()
    return ua.indexOf('micromessenger') !== -1 // true or false
  }

  useEffect(() => {
    // console.log('isWeChat()========', isWeChat())

    isWeChat() && getWxSign()

    if (wxRef.current) {
      wxRef.current?.addEventListener('launch', function (e) {
        console.log('success')
      })
      wxRef.current.addEventListener('error', function (e) {
        console.log('fail', e.detail)
        // 下载 app
        message.error('下载app')
      })
    }
  }, [])

  // 获取微信签名
  const getWxSign = async () => {
    const appid = 'wx855aeedc72847674'
    const timestamp = new Date().getTime() + ''
    const nonceStr = Math.random().toString(36).substr(2, 15)
    const url = window.location.href.split('#')[0]

    let params = {
      url,
      timestamp,
      appid,
      noncestr: nonceStr
    }
    const res = await GetWxSign(params)

    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
      appId: appid, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: nonceStr, // 必填，生成签名的随机串
      signature: res.signature, // 必填，签名
      jsApiList: ['checkJsApi'], // 必填，需要使用的JS接口列表,没有就随便填一个
      openTagList: ['wx-open-launch-app'] //必填， 要申请的开放标签名称
    })
  }

  // 通用唤醒app
  const handleAwakenApp = () => {
    const link = document.createElement('a')
    link.href = `liangshihui://${JSON.stringify(extInfo)}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className='weChat_btn'>
      {isWeChat() ? (
        <wx-open-launch-app ref={wxRef} appid='wx72bd501eeca39211' extinfo={JSON.stringify(extInfo)}>
          <script type='text/wxtag-template'>
            <Button
              type='primary'
              style={{
                background: BASE_COLOR,
                borderRadius: '20px',
                border: 'none',
                color: '#fff',
                padding: '5px 10px',
                ...style
              }}
            >
              {children}
            </Button>
          </script>
        </wx-open-launch-app>
      ) : (
        <Button
          type='primary'
          onClick={handleAwakenApp}
          style={{
            background: BASE_COLOR,
            borderRadius: '20px',
            border: 'none',
            color: '#fff',
            padding: '5px 10px',
            ...style
          }}
        >
          {children}
        </Button>
      )}
    </div>
  )
}

export default React.memo(AwakenApp)
