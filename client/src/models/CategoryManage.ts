import {
  getCourseCategoryList,
  getClassifyList,
  addClassify,
  addCategory,
  deleteCategory,
  deleteClassify,
  getUseasList
} from '@/services/CategoryManage'

export default () => {
  const GetCourseCategoryList = <T>(data: T) => {
    return getCourseCategoryList(data)
  }

  const GetClassifyList = <T>(data: T) => {
    return getClassifyList(data)
  }

  const AddClassify = <T>(data: T) => {
    return addClassify(data)
  }

  const AddCategory = <T>(data: T) => {
    return addCategory(data)
  }

  const DeleteCategory = <T>(data: T) => {
    return deleteCategory(data)
  }

  const DeleteClassify = <T>(data: T) => {
    return deleteClassify(data)
  }

  const GetUseasList = <T>(data: T) => {
    return getUseasList(data)
  }

  return {
    GetCourseCategoryList,
    GetClassifyList,
    AddClassify,
    AddCategory,
    DeleteCategory,
    DeleteClassify,
    GetUseasList
  }
}
