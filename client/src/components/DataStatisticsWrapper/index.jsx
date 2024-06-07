import DataStatisticsItem from '../DataStatisticsItem'
import { useModel } from '@umijs/max'
import { useEffect, useState } from 'react'
import './index.less'
import { Skeleton } from 'antd'

const DataStatisticsWrapper = () => {
  const { DataCommonQuery } = useModel('DataStatistics')
  const [reportData, setReportData] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    getDataPanel()
  }, [])

  const getDataPanel = async () => {
    setDataLoading(true)
    let params = {
      reportList: [
        'static_student_cnt', // 学生注册人数
        'static_teacher_cnt', // 老师注册人数
        'static_income', // 收益
        'static_order', // 支付订单数
        'static_payuser', // 付费用户数
        'static_qacnt', // 答疑未接单数
        'static_dailyactivity' // 浏览量 , 访客数 (日活)
      ]
    }

    const res = await DataCommonQuery(params)
    let tempArr = [
      {
        title: '学生注册人数',
        color: '#6C63FF',
        type: 'static_student_cnt',
        countField: 'allcnt',
        dateField: 'regcnt'
      },
      {
        title: '老师注册人数',
        color: '#FF751A',
        type: 'static_teacher_cnt',
        countField: 'allcnt',
        dateField: 'regcnt'
      },
      {
        title: '收益',
        color: '#FF751A',
        type: 'static_income',
        countField: 'ordercntall',
        dateField: 'ordercntdaily'
      },
      {
        title: '付费用户',
        color: '#9273FF',
        type: 'static_payuser',
        countField: 'cntall',
        dateField: 'dailycnt'
      },
      {
        title: '浏览量',
        color: '#9273FF',
        type: 'static_dailyactivity',
        countField: 'cntall',
        dateField: 'dailycnt'
      },
      {
        title: '支付订单数',
        color: '#6C63FF',
        type: 'static_order',
        countField: 'amountall',
        dateField: 'amountdaily'
      },
      {
        title: '访客数',
        color: '#9273FF',
        type: 'static_dailyactivity',
        countField: 'cntall',
        dateField: 'dailycnt'
      },
      {
        title: '答疑未接单数',
        color: '#9273FF',
        type: 'static_qacnt',
        countField: 'cntall',
        dateField: 'dailycnt'
      }
    ]

    tempArr.forEach((item, index) => {
      params.reportList.forEach((reportItem, reportIndex) => {
        if (item.type === reportItem) {
          let data = res.list[reportIndex].data

          // console.log('data========' + item.title, data)
          item.count = data[0][item.countField] ? data[0][item.countField] : 0
          item.today = data[0][item.dateField] ? data[0][item.dateField] : 0
          item.yesterday = data?.[1]?.[item.dateField] ? data?.[1]?.[item.dateField] : 0
        }
      })
    })

    setReportData(tempArr)
    setDataLoading(false)
  }

  return (
    <div className='data_statistics'>
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
export default DataStatisticsWrapper
