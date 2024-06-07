import { getWxSign, getNoteDetail, getVideoDetail } from '@/services/H5Share'

export default () => {
  // 获取签名
  const GetWxSign = <T>(data: T) => {
    return getWxSign(data)
  }

  // 获取笔记详情
  const GetNoteDetail = <T>(noteId: T) => {
    return getNoteDetail(noteId)
  }

  // 获取视频详情
  const GetVideoDetail = <T>(videoId: T) => {
    return getVideoDetail(videoId)
  }

  return {
    GetWxSign,
    GetNoteDetail,
    GetVideoDetail
  }
}
