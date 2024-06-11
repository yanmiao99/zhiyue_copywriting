import {
  getMenuList,
  addMenu,
  deleteMenu,
  updateMenu,
  getSubMenuList,
  addSubMenu,
  deleteSubMenu,
  updateSubMenu
} from '@/services/MenuManage'

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

  // ____________子菜单____________

  // 获取子菜单列表
  const GetSubMenuList = <T>(data: T) => {
    return getSubMenuList(data)
  }

  // 新增子菜单
  const AddSubMenu = <T>(data: T) => {
    return addSubMenu(data)
  }

  // 删除子菜单
  const DeleteSubMenu = <T>(data: T) => {
    return deleteSubMenu(data)
  }

  // 更新子菜单
  const UpdateSubMenu = <T>(data: T) => {
    return updateSubMenu(data)
  }

  return {
    GetMenuList,
    AddMenu,
    DeleteMenu,
    UpdateMenu,
    GetSubMenuList,
    AddSubMenu,
    DeleteSubMenu,
    UpdateSubMenu
  }
}
