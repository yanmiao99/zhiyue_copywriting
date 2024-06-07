import request from '@/utils/request'

// 获取列表
export async function getTeacherCourseList<T>(data: T) {
  return request('/portal/course/v1/list', {
    method: 'POST',
    data
  })
}

// 获取课程分类
export async function getCourseCategory() {
  return request('/portal/course/v1/category', {
    method: 'GET'
  })
}

// 课程提交审核
export async function courseSubmitAudit<T>(data: T) {
  return request('/portal/course/v1/create', {
    method: 'POST',
    data
  })
}

// 删除课程
export async function deleteCourse<T>(id: T) {
  return request(`/portal/course/v1/${id}`, {
    method: 'DELETE'
  })
}

// 课程存为草稿
export async function courseSaveDraft<T>(data: T) {
  return request('/portal/course/v1/draft', {
    method: 'POST',
    data
  })
}

// 课程详情
export async function getCourseDetail<T>(id: T) {
  return request(`/portal/v1/course/${id}`, {
    method: 'GET'
  })
}

// 删除章
export async function delItemChapter<T>(id: T) {
  return request(`/portal/chapter/v1/${id}`, {
    method: 'DELETE'
  })
}

// 删除节
export async function delItemSection<T>(id: T) {
  return request(`/portal/lesson/v1/${id}`, {
    method: 'DELETE'
  })
}
