import { getVideoList, changeVideoStatus, getItemVideoDetails } from '@/services/VideoAudit'

export default () => {
  const GetVideoList = <T>(data: T) => {
    return getVideoList(data)
  }

  const ChangeVideoStatus = <T>(data: T) => {
    return changeVideoStatus(data)
  }

  const GetItemVideoDetails = <T>(videoId: T) => {
    return getItemVideoDetails(videoId)
  }

  return {
    GetVideoList,
    ChangeVideoStatus,
    GetItemVideoDetails
  }
}
