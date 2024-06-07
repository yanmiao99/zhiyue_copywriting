export default [
  // 管理员
  {
    id: 7,
    menu_name: '数据统计',
    menu_pid: 0,
    menu_sort: 123,
    menu_icon: 'icon-bailongyingxiaoguanli',
    menu_status: 1,
    type: 1,
    path: '/manage/dataStatistics',
    children: [],
    auth: 'admin'
  },
  {
    id: 8,
    menu_name: '人员信息',
    menu_pid: 0,
    menu_sort: 123,
    menu_icon: 'icon-bailongzhanghaoguanli',
    menu_status: 1,
    type: 1,
    auth: 'admin',
    children: [
      {
        id: 20,
        type: 1,
        menu_status: 1,
        menu_name: '学生/家长信息',
        menu_pid: 8,
        path: '/manage/studentOrParentInfo',
        menu_sort: 2,
        menu_icon: '',
        children: [],
        auth: 'admin'
      },
      {
        id: 21,
        type: 1,
        menu_status: 1,
        menu_name: '老师信息',
        menu_pid: 8,
        path: '/manage/teacherInfo',
        menu_sort: 3,
        menu_icon: '',
        children: [],
        auth: 'admin'
      },
      {
        id: 22,
        type: 1,
        menu_status: 1,
        menu_name: '管理员信息',
        menu_pid: 8,
        path: '/manage/manageInfo',
        menu_sort: 3,
        menu_icon: '',
        children: [],
        auth: 'admin'
      }
    ]
  },
  {
    id: 9,
    menu_name: '审核管理',
    menu_pid: 0,
    menu_sort: 123,
    menu_icon: 'icon-bailongshenheguanli',
    menu_status: 1,
    type: 1,
    auth: 'admin',
    children: [
      {
        id: 10,
        type: 1,
        menu_status: 1,
        menu_name: '视频审核',
        menu_pid: 9,
        path: '/manage/videoAudit',
        menu_sort: 2,
        menu_icon: '',
        children: [],
        auth: 'admin'
      },
      {
        id: 11,
        type: 1,
        menu_status: 1,
        menu_name: '课程审核',
        menu_pid: 9,
        path: '/manage/courseAudit',
        menu_sort: 2,
        menu_icon: '',
        children: [],
        auth: 'admin'
      },
      {
        id: 12,
        type: 1,
        menu_status: 1,
        menu_name: '内容举报',
        menu_pid: 9,
        path: '/manage/contentReport',
        menu_sort: 2,
        menu_icon: '',
        children: [],
        auth: 'admin'
      }
    ]
  },
  {
    id: 10,
    menu_name: '优惠券',
    menu_pid: 0,
    menu_sort: 123,
    menu_icon: 'icon-bailongcaiwuguanli',
    menu_status: 1,
    type: 1,
    path: '/manage/coupon',
    children: [],
    auth: 'admin'
  },
  {
    id: 11,
    menu_name: '推广管理',
    menu_pid: 0,
    menu_sort: 123,
    menu_icon: 'icon-bailongshanghuguanli',
    menu_status: 1,
    type: 1,
    children: [
      {
        id: 12,
        type: 1,
        menu_status: 1,
        menu_name: '推广任务',
        menu_pid: 11,
        path: '/manage/promotionManage',
        menu_sort: 2,
        menu_icon: '',
        children: [],
        auth: 'admin'
      },
      {
        id: 13,
        type: 1,
        menu_status: 1,
        menu_name: '推荐码管理',
        menu_pid: 11,
        path: '/manage/recommendCodeManage',
        menu_sort: 2,
        menu_icon: '',
        children: [],
        auth: 'admin'
      }
    ],
    auth: 'admin'
  },
  {
    id: 12,
    menu_name: '通知公告',
    menu_pid: 0,
    menu_sort: 123,
    menu_icon: 'icon-bailongtousujianyi',
    menu_status: 1,
    type: 1,
    path: '/manage/noticeAnnounce',
    children: [],
    auth: 'admin'
  },
  {
    id: 13,
    menu_name: '版本管理',
    menu_pid: 0,
    menu_sort: 123,
    menu_icon: 'icon-bailongpingtaiguanli',
    menu_status: 1,
    type: 1,
    path: '/manage/versionManage',
    children: [],
    auth: 'admin'
  },
  {
    id: 14,
    menu_name: '分类管理',
    menu_pid: 0,
    menu_sort: 123,
    menu_icon: 'icon-bailongdianshangdingdan',
    menu_status: 1,
    type: 1,
    path: '/manage/categoryManage',
    children: [],
    auth: 'admin'
  },
  {
    id: 15,
    menu_name: '帮助文章',
    menu_pid: 0,
    menu_sort: 123,
    menu_icon: 'icon-bailongwenzhangxinxi',
    menu_status: 1,
    type: 1,
    path: '/manage/helpArticleManage',
    children: [],
    auth: 'admin'
  }
]
