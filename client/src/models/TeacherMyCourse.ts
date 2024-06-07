import {
  getTeacherCourseList,
  getCourseCategory,
  courseSubmitAudit,
  deleteCourse,
  courseSaveDraft,
  getCourseDetail,
  delItemChapter,
  delItemSection
} from '@/services/TeacherMyCourse'

export default () => {
  const GetTeacherCourseList = <T>(data: T) => {
    return getTeacherCourseList(data)
  }

  const GetCourseCategory = () => {
    return getCourseCategory()
  }

  const CourseSubmitAudit = <T>(data: T) => {
    return courseSubmitAudit(data)
  }

  const DeleteCourse = <T>(id: T) => {
    return deleteCourse(id)
  }

  const CourseSaveDraft = <T>(data: T) => {
    return courseSaveDraft(data)
  }

  const GetCourseDetail = <T>(id: T) => {
    return getCourseDetail(id)
  }

  const DelItemChapter = <T>(id: T) => {
    return delItemChapter(id)
  }

  const DelItemSection = <T>(id: T) => {
    return delItemSection(id)
  }

  return {
    GetTeacherCourseList,
    GetCourseCategory,
    CourseSubmitAudit,
    DeleteCourse,
    CourseSaveDraft,
    GetCourseDetail,
    DelItemChapter,
    DelItemSection
  }
}
