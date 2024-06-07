import { getDownloadInfo } from '@/services/DownloadCenter'

export default () => {
  // 获取下载中心信息
  const GetDownloadInfo = <T>(platform: T) => {
    return getDownloadInfo(platform)
  }

  return {
    GetDownloadInfo
  }
}
