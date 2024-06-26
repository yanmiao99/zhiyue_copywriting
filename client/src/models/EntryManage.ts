import {
  getCategoryDetailsList,
  addCategoryDetails,
  deleteCategoryDetails,
  updateCategoryDetails
} from '@/services/EntryManage'

export default () => {
  // 获取分类列表
  const GetCategoryDetailsList = <T>(data: T) => {
    return getCategoryDetailsList(data)
  }

  // 新增分类
  const AddCategoryDetails = <T>(data: T) => {
    return addCategoryDetails(data)
  }

  // 删除分类
  const DeleteCategoryDetails = <T>(data: T) => {
    return deleteCategoryDetails(data)
  }

  // 更新分类
  const UpdateCategoryDetails = <T>(data: T) => {
    return updateCategoryDetails(data)
  }

  return {
    GetCategoryDetailsList,
    AddCategoryDetails,
    DeleteCategoryDetails,
    UpdateCategoryDetails
  }
}
