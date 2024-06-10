import { getMenuList, addMenu, deleteMenu, updateMenu } from '@/services/MenuManage'

export default () => {
  // 获取列表
  const GetMenuList = <T>(data: T) => {
    return getMenuList(data)
  }

  // 新增
  const AddMenu = <T>(data: T) => {
    return addMenu(data)
  }

  // 删除
  const DeleteMenu = <T>(data: T) => {
    return deleteMenu(data)
  }

  // 更新
  const UpdateMenu = <T>(data: T) => {
    return updateMenu(data)
  }

  return {
    GetMenuList,
    AddMenu,
    DeleteMenu,
    UpdateMenu
  }
}
