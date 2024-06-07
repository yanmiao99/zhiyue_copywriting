import React, { useState, useRef } from 'react'
import { useModel, useLocation } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App } from 'antd'

export default () => {
  const location = useLocation()
  const { GetRewardsList } = useModel('RecommendCodeManage')
  const { message, modal } = App.useApp()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(() => {
    return location.state?.currentPage || 1
  }) //  当前页码

  const tableRef = useRef()

  const originColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      hideInSearch: true,
      align: 'center',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '用户名',
      dataIndex: 'nickname',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center'
    },
    {
      title: '邀请用户数量',
      dataIndex: 'allcnt',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: ' 获得奖励总金额',
      dataIndex: 'amountall',
      hideInSearch: true,
      align: 'center'
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          ...params
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetRewardsList(param)

        const { list, total } = res

        return {
          data: list,
          success: true,
          total: total
        }
      }}
      pagination={{
        pageSize: pageSize,
        current: currentPage
      }}
      scroll={{ x: 'max-content' }}
      rowKey='id'
      columns={originColumns}
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
        span: 12
      }}
    />
  )
}
