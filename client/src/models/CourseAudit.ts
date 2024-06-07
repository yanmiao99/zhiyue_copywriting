import {
  getCourseList,
  changeCourseStatus,
  getItemCourseDetails,
  getChaptersList,
  getLessonsList
} from '@/services/CourseAudit'

export default () => {
  const GetCourseList = <T>(data: T) => {
    return getCourseList(data)
  }

  const ChangeCourseStatus = <T>(data: T) => {
    return changeCourseStatus(data)
  }

  const GetItemCourseDetails = <T>(courseId: T) => {
    return getItemCourseDetails(courseId)
  }

  const GetChaptersList = <T>(id: T) => {
    return getChaptersList(id)
  }

  const GetLessonsList = <T>(id: T) => {
    return getLessonsList(id)
  }

  return {
    GetCourseList,
    ChangeCourseStatus,
    GetItemCourseDetails,
    GetChaptersList,
    GetLessonsList
  }
}
