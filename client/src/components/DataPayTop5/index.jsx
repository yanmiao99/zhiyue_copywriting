import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
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
      title: '用户昵称',
      dataIndex: 'nickname',
      align: 'center'
    },
    {
      title: '付费总额',
      dataIndex: 'amount',
      align: 'center'
    },
    {
      title: '购买数',
      dataIndex: 'ordercnt',
      align: 'center'
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        let param = {
          reportList: ['static_payusertop']
        }

        const res = await DataCommonQuery(param)
        // console.log('res========', res)

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
