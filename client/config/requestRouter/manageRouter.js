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
    menu_name: '词条管理',
    menu_pid: 0,
    menu_icon: 'icon-zhiyue-citiaoguanli',
    path: '/manage/EntryManage',
    children: [],
    auth: 'admin'
  },
  {
    id: 3,
    menu_name: '用户管理',
    menu_pid: 0,
    menu_icon: 'icon-zhiyue-yonghuguanli',
    path: '/manage/UserManage',
    children: [],
    auth: 'admin'
  }
  // {
  //   id: 4,
  //   menu_name: '菜单管理',
  //   menu_pid: 0,
  //   menu_icon: 'icon-zhiyue-caidanguanli',
  //   path: '/manage/menuManage',
  //   children: [],
  //   auth: 'admin'
  // }
]
