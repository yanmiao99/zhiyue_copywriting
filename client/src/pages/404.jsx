import React from 'react'
import { Result, Button } from 'antd'
import { history } from '@umijs/max'
import { BASE_COLOR } from '@/constants'

const NoFoundPage = () => {
  const handleToHome = () => {
    const { pathname } = history.location
    if (pathname.includes('/manage')) {
      history.push('/manage')
    } else {
      history.push('/open/home')
    }
  }

  return (
    <Result
      status='404'
      title='404'
      subTitle='抱歉，您访问的页面不存在。'
      extra={[
        <Button key='back' style={{ background: BASE_COLOR }} type='primary' onClick={() => history.back()}>
          返回上一页
        </Button>,
        <Button key='home' style={{ background: BASE_COLOR }} type='primary' onClick={() => handleToHome()}>
          回到首页
        </Button>
      ]}
    />
  )
}
export default NoFoundPage
