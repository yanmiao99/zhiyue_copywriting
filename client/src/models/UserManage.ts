import { getUserList, deleteUser, registerUser, updateUser } from '@/services/UserManage'

export default () => {
  // 获取用户列表
  const GetUserList = <T>(data: T) => {
    return getUserList(data)
  }

  // 删除用户
  const DeleteUser = <T>(data: T) => {
    return deleteUser(data)
  }

  // 新增用户
  const RegisterUser = <T>(data: T) => {
    return registerUser(data)
  }

  // 更新用户
  const UpdateUser = <T>(data: T) => {
    return updateUser(data)
  }

  return {
    GetUserList,
    DeleteUser,
    RegisterUser,
    UpdateUser
  }
}
