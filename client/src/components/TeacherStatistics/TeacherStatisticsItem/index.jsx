import { useCountUp } from 'react-countup'
import React, { useRef, useEffect } from 'react'
import './index.less'
const TeacherStatisticsItem = ({ item }) => {
  const countRef = useRef(null)
  const numberAnimation = useCountUp({
    ref: countRef,
    start: 0,
    end: 0,
    duration: 1.5
  })

  useEffect(() => {
    numberAnimation.update(item.number)
  }, [])

  return (
    <div className='teacher_statistics_item'>
      <div className='teacher_statistics_count' ref={countRef} />
      <div className='teacher_statistics_title'>{item.title}</div>
    </div>
  )
}
export default TeacherStatisticsItem
