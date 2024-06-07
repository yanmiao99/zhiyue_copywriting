import {
  getAnnouncementList,
  deleteAnnouncementItem,
  addAndEditAnnouncement,
  checkAnnouncementDetails,
  sendAnnouncementNotify
} from '@/services/NoticeAnnounce'

export default () => {
  const GetAnnouncementList = <T>(data: T) => {
    return getAnnouncementList(data)
  }

  const DeleteAnnouncementItem = <T>(id: T) => {
    return deleteAnnouncementItem(id)
  }

  const AddAndEditAnnouncement = <T>(data: T) => {
    return addAndEditAnnouncement(data)
  }

  const CheckAnnouncementDetails = <T>(id: T) => {
    return checkAnnouncementDetails(id)
  }

  const SendAnnouncementNotify = <T>(data: T) => {
    return sendAnnouncementNotify(data)
  }

  return {
    GetAnnouncementList,
    DeleteAnnouncementItem,
    AddAndEditAnnouncement,
    CheckAnnouncementDetails,
    SendAnnouncementNotify
  }
}
