import { getOTAVersionList, upsertOTAVersion } from '@/services/VersionManage'

export default () => {
  // 获取列表
  const GetOTAVersionList = <T>(data: T) => {
    return getOTAVersionList(data)
  }

  // 发布
  const UpsertOTAVersion = <T>(data: T) => {
    return upsertOTAVersion(data)
  }

  return {
    GetOTAVersionList,
    UpsertOTAVersion
  }
}
