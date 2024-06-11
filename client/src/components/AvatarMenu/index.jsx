import React, { useEffect, useState } from 'react'
import './index.less'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { Dropdown, Avatar } from 'antd'
import { history, useModel } from '@umijs/max'
import { clearLogin } from '@/utils/utils'

const AvatarMenu = () => {
  const { userInfo } = useModel('Global')
  const [items, setItems] = useState([
    {
      label: '个人中心',
      key: 'center',
      icon: <UserOutlined />
    },
    {
      label: '退出登录',
      key: 'exit',
      icon: <LogoutOutlined />
    }
  ])

  const handleExitUserLogin = () => {
    clearLogin()
    history.replace('/main/login')
  }

  const keyMap = {
    exit: () => handleExitUserLogin()
  }

  const handleMenuClick = ({ key }) => {
    keyMap[key]()
  }

  const menuProps = {
    items,
    onClick: handleMenuClick
  }

  return (
    <Dropdown menu={menuProps} trigger={['click']}>
      <div className={'box'}>
        <span>{userInfo.username}</span>
        <Avatar size='small' icon={<UserOutlined />} />
      </div>
    </Dropdown>
  )
}

export default AvatarMenu
