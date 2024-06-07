import { getManageList, changeManageStatus, createManageUser, updateManageUser } from '@/services/ManageInfo'

export default () => {
  const GetManageList = <T>(data: T) => {
    return getManageList(data)
  }

  const ChangeManageStatus = <T>(data: T) => {
    return changeManageStatus(data)
  }

  const CreateManageUser = <T>(data: T) => {
    return createManageUser(data)
  }

  const UpdateManageUser = <T>(data: T) => {
    return updateManageUser(data)
  }

  return {
    GetManageList,
    ChangeManageStatus,
    CreateManageUser,
    UpdateManageUser
  }
}
