export default [
  // 管理员
  {
    id: 1,
    menu_name: '分类管理',
    menu_pid: 0,
    menu_icon: 'icon-zhiyue-fenleiguanli',
    path: '/manage/CategoryManage',
    children: [],
    auth: 'admin'
  },
  {
    id: 2,
    menu_name: '用户管理',
    menu_pid: 0,
    menu_icon: 'icon-zhiyue-yonghuguanli',
    path: '/manage/UserManage',
    children: [],
    auth: 'admin'
  }
]
