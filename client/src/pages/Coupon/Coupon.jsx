import React, { useState, useRef } from 'react'
import { useModel, history, useLocation } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Popconfirm, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { BASE_COLOR } from '@/constants'
import dayjs from 'dayjs'
import './Coupon.less'
import CouponDetailsModal from './CouponDetailsModal/CouponDetailsModal'

export default () => {
  const location = useLocation()
  const { GetCouponList, ChangeCouponStatus, DelCoupon, CheckCouponDetails } = useModel('Coupon')
  const { message, modal } = App.useApp()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(() => {
    return location.state?.currentPage || 1
  }) //  当前页码

  const tableRef = useRef()

  // 查看详情
  const handleCheckDetails = async row => {
    modal.info({
      title: '优惠券详情',
      width: 600,
      maskClosable: true,
      icon: null,
      content: <CouponDetailsModal activityid={row.activityid} />,
      okText: '关闭'
    })
  }

  // 添加和编辑
  const handleAddAndEdit = (type, row) => {
    history.push('/manage/coupon/couponAddAndEdit', {
      type,
      activityid: row?.activityid,
      currentRow: JSON.stringify(row),
      currentPage,
      currentPath: location.pathname
    })
  }

  // 更改状态
  const handleChangeStatus = async row => {
    let params = {
      activityid: row.activityid,
      status: row.status === 2 ? 1 : 2
    }

    await ChangeCouponStatus(params)

    tableRef.current.reload()
    message.success('更改成功')
  }

  // 处理删除
  const handleDelete = async row => {
    await DelCoupon(row.activityid)
    tableRef.current.reload()
    message.success('删除成功')
  }

  const originColumns = [
    {
      title: '优惠券名称',
      dataIndex: 'name',
      width: 100
    },
    {
      title: '优惠券有效期',
      width: 130,
      valueType: 'dateTimeRange',
      render: (_, row) => {
        return (
          <div>
            {dayjs(row.effectivetime).format('YYYY-MM-DD HH:mm:ss')}
            <div>~</div>
            {dayjs(row.expirestime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        )
      },
      search: {
        transform: value => {
          return {
            start: value[0],
            end: value[1]
          }
        }
      }
    },
    {
      title: '优惠金额',
      dataIndex: 'discount',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '派发人群',
      dataIndex: 'distribroles',
      width: 100,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        1: {
          text: '学生'
        },
        2: {
          text: '老师'
        },
        5: {
          text: '客服'
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      hideInSearch: true,
      valueEnum: {
        1: {
          text: '启用',
          status: 'Success'
        },
        2: {
          text: '禁用',
          status: 'Error'
        }
      }
    },
    {
      title: '推广详情',
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (_, row) => {
        return (
          <Button type='link' style={{ color: BASE_COLOR }} onClick={() => handleCheckDetails(row)}>
            查看详情
          </Button>
        )
      }
    },
    {
      title: '操作',
      key: 'option',
      width: 150,
      valueType: 'option',
      fixed: 'right',
      align: 'right',
      render: (_, row) => {
        return (
          <Space size={[8, 8]} wrap>
            <Button key='edit' ghost type='primary' onClick={() => handleAddAndEdit('edit', row)}>
              编辑
            </Button>
            <Popconfirm
              key='status'
              title='你确定更改状态吗？'
              onConfirm={() => handleChangeStatus(row)}
              okText='确认'
              cancelText='取消'
            >
              <Button key={Math.random().toString()} type='primary' danger={row.status === 1} ghost>
                {row.status === 1 ? '禁用' : '启用'}
              </Button>
            </Popconfirm>
            <Popconfirm
              key='delete'
              title='你确定删除吗？'
              onConfirm={() => handleDelete(row)}
              okText='确认'
              cancelText='取消'
            >
              <Button key={Math.random().toString()} type='primary' danger ghost>
                删除
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        const filters = {
          name: params.name,
          distribrole: Number(params.distribroles),
          end: params.end,
          start: params.start
        }

        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          ...filters
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetCouponList(param)

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
      rowKey='activityid'
      columns={originColumns}
      headerTitle={
        <Button
          icon={<PlusCircleOutlined />}
          key={Math.random().toString()}
          type='primary'
          style={{ marginRight: '10px' }}
          onClick={() => handleAddAndEdit('add')}
        >
          新增优惠券
        </Button>
      }
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
        span: 12
      }}
    />
  )
}
