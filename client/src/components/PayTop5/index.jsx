import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { Image } from 'antd'
export default () => {
  const { PayTop } = useModel('DataStatistics')

  const tableRef = useRef()

  const originColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      align: 'center'
    },
    {
      title: '用户头像',
      dataIndex: 'avatar',
      align: 'center',
      render: (_, record) => {
        return (
          <Image
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%'
            }}
            src={record.avatar}
          />
        )
      }
    },
    {
      title: '用户名字',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '支付金额',
      dataIndex: 'amount',
      align: 'center'
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        const res = await PayTop()

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
