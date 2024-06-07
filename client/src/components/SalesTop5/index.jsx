import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { Image } from 'antd'
export default () => {
  const { CourseTop } = useModel('DataStatistics')

  const tableRef = useRef()

  const originColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      align: 'center'
    },
    {
      title: '课程信息',
      align: 'center',
      render: (_, record) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              style={{
                width: '100px',
                height: '50px',
                borderRadius: '5px',
                marginRight: '5px'
              }}
              src={record.courseCover}
            />
            <span>{record.courseName}</span>
          </div>
        )
      }
    },
    {
      title: '访问量',
      dataIndex: 'visitsCount',
      align: 'center'
    },
    {
      title: '支付量',
      dataIndex: 'payCount',
      align: 'center'
    },
    {
      title: '支付转化率',
      dataIndex: 'payRate',
      align: 'center'
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        const res = await CourseTop()
        return {
          data: res.list,
          success: true,
          total: res.list.length
        }
      }}
      pagination={false}
      search={false}
      options={{
        fullScreen: false,
        reload: false,
        setting: false,
        density: false
      }}
      scroll={{ x: 'max-content' }}
      rowKey='rank'
      columns={originColumns}
    />
  )
}
