import { history, useLocation } from '@umijs/max'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useImperativeHandle, forwardRef } from 'react'
import './index.less'

const BackPage = ({}, ref) => {
  const location = useLocation()
  const handleBackGo = () => {
    // 判断是否有传递 currentPath , 如果有, 则跳转到 currentPath , 参数使用 currentPage , 否则返回上一页
    const { currentPage, currentPath } = location.state
    if (currentPath) {
      history.push(currentPath, { currentPage })
    } else {
      history.go(-1)
    }
  }

  // 将子组件的方法暴露给父组件
  useImperativeHandle(ref, () => ({
    handleBackGo
  }))

  return (
    <>
      <div className='back_page' onClick={() => handleBackGo()}>
        <ArrowLeftOutlined />
        <span>返回</span>
      </div>
    </>
  )
}

export default forwardRef(BackPage)
