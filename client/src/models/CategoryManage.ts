import { getCategoryList, addCategory, deleteCategory, updateCategory } from '@/services/CategoryManage'

export default () => {
  // 获取分类列表
  const GetCategoryList = <T>(data: T) => {
    return getCategoryList(data)
  }

  // 新增分类
  const AddCategory = <T>(data: T) => {
    return addCategory(data)
  }

  // 删除分类
  const DeleteCategory = <T>(data: T) => {
    return deleteCategory(data)
  }

  // 更新分类
  const UpdateCategory = <T>(data: T) => {
    return updateCategory(data)
  }

  return {
    GetCategoryList,
    AddCategory,
    DeleteCategory,
    UpdateCategory
  }
}
