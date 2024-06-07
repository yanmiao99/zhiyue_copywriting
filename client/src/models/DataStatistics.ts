import { dataCommonQuery, payTop, courseTop, courseDetail, orderPanel } from '@/services/DataStatistics'

export default () => {
  const DataCommonQuery = <T>(params: T) => {
    return dataCommonQuery(params)
  }

  const PayTop = <T>(params: T) => {
    return payTop(params)
  }

  const CourseTop = <T>(params: T) => {
    return courseTop(params)
  }

  const CourseDetail = <T>(params: T) => {
    return courseDetail(params)
  }

  const OrderPanel = <T>(params: T) => {
    return orderPanel(params)
  }

  return {
    DataCommonQuery,
    PayTop,
    CourseTop,
    CourseDetail,
    OrderPanel
  }
}
