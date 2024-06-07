import { getReportList, changeReportStatus, getItemReportDetails } from '@/services/ContentReport'

export default () => {
  const GetReportList = <T>(data: T) => {
    return getReportList(data)
  }

  const ChangeReportStatus = <T>(data: T) => {
    return changeReportStatus(data)
  }

  const GetItemReportDetails = <T>(data: T) => {
    return getItemReportDetails(data)
  }

  return {
    GetReportList,
    ChangeReportStatus,
    GetItemReportDetails
  }
}
