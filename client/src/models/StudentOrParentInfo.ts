import { getStudentList, changeStudentStatus, getGoldDetail, getRechargeDetail } from '@/services/StudentOrParentInfo'

export default () => {
  const GetStudentList = <T>(data: T) => {
    return getStudentList(data)
  }

  const ChangeStudentStatus = <T>(data: T) => {
    return changeStudentStatus(data)
  }

  const GetGoldDetail = <T>(data: T) => {
    return getGoldDetail(data)
  }

  const GetRechargeDetail = <T>(data: T) => {
    return getRechargeDetail(data)
  }

  return {
    GetStudentList,
    ChangeStudentStatus,
    GetGoldDetail,
    GetRechargeDetail
  }
}
