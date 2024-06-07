import React from 'react'
import { Button } from 'antd'
import success from '@/assets/common/success.png'
import { useEffect, useState } from 'react'

const ResetPwdStatus = ({ setPageStatus, PAGE_STATUS }) => {
  const [time, setTime] = useState(5)

  // 回转登陆页面
  const handleBackLogin = () => {
    setPageStatus(PAGE_STATUS.LOGIN)
  }

  // 倒计时
  useEffect(() => {
    let timer = setInterval(() => {
      setTime(time - 1)
    }, 1000)

    if (time === 0) {
      setPageStatus(PAGE_STATUS.LOGIN)
    }

    return () => {
      clearInterval(timer)
    }
  }, [time])

  return (
    <div style={{ marginTop: 80 }}>
      <img
        style={{
          height: 100,
          display: 'block',
          margin: '60px auto'
        }}
        src={success}
        alt='重置成功'
      />
      <Button size='large' block type='primary' key='console' onClick={handleBackLogin}>
        {time} 前往登陆
      </Button>
    </div>
  )
}
export default ResetPwdStatus
