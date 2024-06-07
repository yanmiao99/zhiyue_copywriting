import { getVideoList, stagingVideoDraft, submitVideoAudit, deleteVideo } from '@/services/MyVideo'

export default () => {
  const GetVideoList = <T>(data: T) => {
    return getVideoList(data)
  }

  const StagingVideoDraft = <T>(data: T) => {
    return stagingVideoDraft(data)
  }

  const SubmitVideoAudit = <T>(data: T) => {
    return submitVideoAudit(data)
  }

  const DeleteVideo = <T>(data: T) => {
    return deleteVideo(data)
  }

  return {
    GetVideoList,
    StagingVideoDraft,
    SubmitVideoAudit,
    DeleteVideo
  }
}
