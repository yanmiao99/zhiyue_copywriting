import { useModel } from '@umijs/max'
import { useEffect, useState } from 'react'
import { App, Empty } from 'antd'
import './DownloadCenter.less'

function DownloadCenter() {
  const { GetDownloadInfo } = useModel('DownloadCenter')

  const [downloadInfo, setDownloadInfo] = useState({})

  const [loading, setLoading] = useState(true)

  const [loadingText, setLoadingText] = useState('加载中...')

  const { message } = App.useApp()

  useEffect(() => {
    // 判断当前是电脑还是手机, 如果是电脑则不允许访问
    if (!navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {
      message.error('请使用手机访问')
      setLoadingText('暂时不支持电脑访问')
      setLoading(true)
      return
    }

    getDownloadInfo()
  }, [])

  const getDownloadInfo = async () => {
    setLoading(true)
    setLoadingText('数据出错了,请联系管理员 ~')
    const res = await GetDownloadInfo('android')
    setDownloadInfo(res)
    setLoading(false)
  }

  const handleDownloadApp = (item, type) => {
    if (type === 'ios') {
      message.error('暂未开放ios下载')
    }

    if (type === 'android') {
      message.success('即将开始下载,请稍等...')
      window.open(item.otapath)
    }
  }

  return (
    <>
      {loading ? (
        <div className='empty'>
          <Empty description={loadingText} />
        </div>
      ) : (
        <div className='download_wrapper'>
          {downloadInfo && JSON.stringify(downloadInfo) !== '{}' && (
            <div>
              <div className='update_time'>更新时间：{downloadInfo.updatetime}</div>
              <div className='btn ios_btn' onClick={() => handleDownloadApp(downloadInfo, 'ios')}></div>
              <div className='btn android_btn' onClick={() => handleDownloadApp(downloadInfo, 'android')}></div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default DownloadCenter
