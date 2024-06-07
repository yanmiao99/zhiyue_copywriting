import React, { useEffect, useState } from 'react'
import TeacherStatisticsItem from './TeacherStatisticsItem'
import './index.less'
import { useModel } from '@umijs/max'

const TeacherStatistics = () => {
  const { OrderPanel } = useModel('DataStatistics')
  const [dataList, setDataList] = useState([])

  useEffect(() => {
    getDataPanel()
  }, [])

  const getDataPanel = async () => {
    const res = await OrderPanel()
    setDataList(res.list)
  }

  return (
    <div className='teacher_statistics'>
      {dataList &&
        dataList.length &&
        dataList.map((item, index) => {
          return <TeacherStatisticsItem key={index} item={item} />
        })}
    </div>
  )
}
export default TeacherStatistics
