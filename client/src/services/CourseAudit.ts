import request from '@/utils/request'

// 获取列表
export async function getCourseList<T>(data: T) {
  return request('/admin/v1/course/list', {
    method: 'POST',
    data
  })
}

// 封禁/解封
export async function changeCourseStatus<T>(data: T) {
  return request(`/admin/v1/course/status`, {
    method: 'PUT',
    data
  })
}

// 查看单条视频详情
export async function getItemCourseDetails<T>(courseId: T) {
  return request(`/admin/v1/course/${courseId}`, {
    method: 'GET'
  })
}

// 获取课程
export async function getChaptersList<T>(id: T) {
  return request(`/admin/v1/chapters/${id}`, {
    method: 'GET'
  })
}

// 获取章节
export async function getLessonsList<T>(id: T) {
  return request(`/admin/v1/lessons/${id}`, {
    method: 'GET'
  })
}
