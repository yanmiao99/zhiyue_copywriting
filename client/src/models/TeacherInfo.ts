import {
  getTeacherList,
  changeTeacherStatus,
  changeTeacherAuth,
  getTeacherAuthDetails,
  getTeacherIncomeDetails
} from '@/services/TeacherInfo'

export default () => {
  const GetTeacherList = <T>(data: T) => {
    return getTeacherList(data)
  }

  const ChangeTeacherStatus = <T>(data: T) => {
    return changeTeacherStatus(data)
  }

  const ChangeTeacherAuth = <T>(data: T) => {
    return changeTeacherAuth(data)
  }

  const GetTeacherAuthDetails = <T>(data: T) => {
    return getTeacherAuthDetails(data)
  }

  const GetTeacherIncomeDetails = <T>(data: T) => {
    return getTeacherIncomeDetails(data)
  }

  return {
    GetTeacherList,
    ChangeTeacherStatus,
    ChangeTeacherAuth,
    GetTeacherAuthDetails,
    GetTeacherIncomeDetails
  }
}
