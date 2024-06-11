import request from '@/utils/request'

// 获取列表
export async function getMenuList<T>(data: T) {
  return request('/api/menu/list', {
    method: 'GET',
    data
  })
}

// 新增
export async function addMenu<T>(data: T) {
  return request('/api/menu/add', {
    method: 'POST',
    data
  })
}

// 删除
export async function deleteMenu<T>(data: T) {
  return request('/api/menu/delete', {
    method: 'POST',
    data
  })
}

// 更新
export async function updateMenu<T>(data: T) {
  return request('/api/menu/update', {
    method: 'POST',
    data
  })
}

// 子菜单 ------------------------------

// 获取子菜单列表
export async function getSubMenuList<T>(data: T) {
  return request('/api/subMenu/list', {
    method: 'GET',
    data
  })
}

// 新增子菜单
export async function addSubMenu<T>(data: T) {
  return request('/api/subMenu/add', {
    method: 'POST',
    data
  })
}

// 删除子菜单
export async function deleteSubMenu<T>(data: T) {
  return request('/api/subMenu/delete', {
    method: 'POST',
    data
  })
}

// 更新子菜单
export async function updateSubMenu<T>(data: T) {
  return request('/api/subMenu/update', {
    method: 'POST',
    data
  })
}
