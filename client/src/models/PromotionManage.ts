import {
  addAndEditPromotion,
  changePromotionStatus,
  delPromotion,
  getPromotionList,
  checkPromotionDetails,
  checkItemPromotionDetails
} from '@/services/PromotionManage'

export default () => {
  const GetPromotionList = <T>(data: T) => {
    return getPromotionList(data)
  }

  const ChangePromotionStatus = <T>(data: T) => {
    return changePromotionStatus(data)
  }
  const DelPromotion = <T>(data: T) => {
    return delPromotion(data)
  }

  const AddAndEditPromotion = <T>(data: T) => {
    return addAndEditPromotion(data)
  }

  const CheckPromotionDetails = <T>(id: T) => {
    return checkPromotionDetails(id)
  }

  const CheckItemPromotionDetails = <T>(id: T) => {
    return checkItemPromotionDetails(id)
  }

  return {
    GetPromotionList,
    ChangePromotionStatus,
    DelPromotion,
    AddAndEditPromotion,
    CheckPromotionDetails,
    CheckItemPromotionDetails
  }
}
