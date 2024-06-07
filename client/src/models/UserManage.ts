import { getUserList } from '@/services/UserManage'

export default () => {
  // 获取用户列表
  const GetUserList = <T>(data: T) => {
    return getUserList(data)
  }

  return {
    GetUserList
  }
}
