import {
  changeCouponStatus,
  delCoupon,
  getCouponList,
  checkCouponDetails,
  upsertCoupon
} from '@/services/Coupon'

export default () => {
  const GetCouponList = <T>(data: T) => {
    return getCouponList(data)
  }

  const ChangeCouponStatus = <T>(data: T) => {
    return changeCouponStatus(data)
  }
  const DelCoupon = <T>(activityId: T) => {
    return delCoupon(activityId)
  }

  const AddAndEditCoupon = <T>(data: T) => {
    return upsertCoupon(data)
  }

  const CheckCouponDetails = <T>(activityId: T) => {
    return checkCouponDetails(activityId)
  }

  return {
    GetCouponList,
    ChangeCouponStatus,
    DelCoupon,
    AddAndEditCoupon,
    CheckCouponDetails
  }
}
