import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { Image } from 'antd'
import Top1 from '@/assets/common/top1.png'
import Top2 from '@/assets/common/top2.png'
import Top3 from '@/assets/common/top3.png'

export default () => {
  const { DataCommonQuery } = useModel('DataStatistics')
  const tableRef = useRef()

  const originColumns = [
    {
      title: '排名',
      dataIndex: 'links',
      align: 'center',
      render: (_, record, index) => {
        return (
          <div>
            {index === 0 && <img style={{ width: '35px', height: '35px' }} src={Top1} />}
            {index === 1 && <img style={{ width: '35px', height: '35px' }} src={Top2} />}
            {index === 2 && <img style={{ width: '35px', height: '35px' }} src={Top3} />}
            {index > 2 && <span>{index}</span>}
          </div>
        )
      }
    },
    {
      title: '课程信息',
      align: 'center',
      render: (_, record) => {
        return (
          <Image
            style={{
              width: '100px',
              height: '50px',
              borderRadius: '5px',
              marginRight: '5px'
            }}
            src={record.logourl}
          />
        )
      }
    },
    {
      title: '购买量',
      dataIndex: 'buycounts',
      align: 'center'
    },
    {
      title: '收藏数',
      dataIndex: 'favorites',
      align: 'center'
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      align: 'center'
    },
    {
      title: '浏览量',
      dataIndex: 'viewcount',
      align: 'center'
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        let param = {
          reportList: ['static_courserank']
        }

        const res = await DataCommonQuery(param)

        return {
          data: res.list[0].data,
          success: true,
          total: res.list[0].data.length
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
      rowKey='courseid'
      columns={originColumns}
    />
  )
}
