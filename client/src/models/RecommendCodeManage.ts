import { getRewardsList } from '@/services/RecommendCodeManage'

export default () => {
  const GetRewardsList = <T>(data: T) => {
    return getRewardsList(data)
  }

  return {
    GetRewardsList
  }
}
