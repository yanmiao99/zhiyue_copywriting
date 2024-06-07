import './index.less'
import DataStatisticsItem from '../DataStatisticsItem'
import { useModel } from '@umijs/max'
import { useEffect, useState } from 'react'
import { Skeleton } from 'antd'

const TeacherDataBox = () => {
  const { CourseDetail } = useModel('DataStatistics')
  const [reportData, setReportData] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    getDataPanel()
  }, [])

  const getDataPanel = async () => {
    setDataLoading(true)
    const res = await CourseDetail()

    let tempArr = [
      {
        title: '支付金额',
        color: '#6C63FF'
      },
      {
        title: '访客数',
        color: '#FF751A'
      },
      {
        title: '浏览量',
        color: '#FF751A'
      },
      {
        title: '支付买家数',
        color: '#9273FF'
      },
      {
        title: '点赞数',
        color: '#9273FF'
      },
      {
        title: '总收益',
        color: '#6C63FF'
      },
      {
        title: '提现',
        color: '#6C63FF'
      },
      {
        title: '收藏课程人数',
        color: '#9273FF'
      },
      {
        title: '学习人数',
        color: '#9273FF'
      }
    ]

    tempArr.forEach(item => {
      res.list.forEach(item2 => {
        if (item.title === item2.title) {
          item.count = item2.count
          item.yesterday = item2.yesterday
          item.surplus = item2.surplus
        }
      })
    })

    setReportData(tempArr)
    setDataLoading(false)
  }

  return (
    <div className='teacher_data_box'>
      {dataLoading ? (
        <>
          {Array(10)
            .fill()
            .map((_, i) => i + 1)
            .map((item, index) => {
              return (
                <div key={index} className='data_statistics_item'>
                  <Skeleton active />
                </div>
              )
            })}
        </>
      ) : (
        reportData.map((item, index) => {
          return <DataStatisticsItem data={item} key={index} className='data_statistics_item' />
        })
      )}
    </div>
  )
}
export default TeacherDataBox
