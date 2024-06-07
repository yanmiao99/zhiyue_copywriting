import React, { useState, useRef } from 'react'
import { useModel, history, useLocation } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Popconfirm, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { BASE_COLOR } from '@/constants'
import dayjs from 'dayjs'
import './PromotionManage.less'
import PromotionDetailsModal from './PromotionDetailsModal/PromotionDetailsModal'

export default () => {
  const location = useLocation()
  const { GetPromotionList, ChangePromotionStatus, DelPromotion, CheckItemPromotionDetails } =
    useModel('PromotionManage')
  const { message, modal } = App.useApp()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(() => {
    return location.state?.currentPage || 1
  }) //  当前页码

  const tableRef = useRef()

  // 查看详情
  const handleCheckDetails = async row => {
    const res = await CheckItemPromotionDetails(row.id)

    modal.info({
      title: '推广详情',
      width: 800,
      maskClosable: true,
      icon: null,
      content: <PromotionDetailsModal res={res} />,
      okText: '关闭'
    })
  }

  // 添加和编辑
  const handleAddAndEdit = (type, row) => {
    history.push('/manage/promotionManage/promotionAddAndEdit', {
      type,
      id: row?.id,
      currentPage,
      currentPath: location.pathname
    })
  }

  // 更改状态
  const handleChangeStatus = async row => {
    let params = {
      id: row.id,
      status: row.status === 1 ? 2 : 1
    }

    await ChangePromotionStatus(params)
    tableRef.current.reload()
    message.success('更改成功')
  }

  // 处理删除
  const handleDelete = async row => {
    await DelPromotion({ id: row.id })
    tableRef.current.reload()
    message.success('删除成功')
  }

  const originColumns = [
    {
      title: '推广任务名称',
      dataIndex: 'title',
      width: 100
    },
    {
      title: '推广有效期',
      dataIndex: 'begintime',
      width: 130,
      valueType: 'dateTimeRange',
      render: (_, row) => {
        return (
          <div>
            {dayjs(row.begintime).format('YYYY-MM-DD HH:mm:ss')}
            <div>~</div>
            {dayjs(row.endtime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        )
      },
      search: {
        transform: value => {
          return {
            begintime: value[0],
            endtime: value[1]
          }
        }
      }
    },
    {
      title: '推广返利',
      dataIndex: 'rewardrules',
      width: 80,
      align: 'center',
      hideInSearch: true,
      render: (_, row) => {
        return <div>¥ {row.rewardrules.rewardval}</div>
      }
    },
    {
      title: '推广人员',
      dataIndex: 'tousertype',
      width: 100,
      align: 'center',
      valueEnum: {
        1: {
          text: '学生',
          status: 'Success'
        },
        2: {
          text: '老师',
          status: 'Warning'
        },
        3: {
          text: '自定义人群',
          status: 'Processing'
        },
        5: {
          text: '客服',
          status: 'Default'
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
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '未开始',
          status: 'Default'
        },
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
          title: params.title,
          tousertype: Number(params.tousertype),
          endtime: params.endtime,
          begintime: params.begintime
        }

        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          ...filters
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetPromotionList(param)

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
      headerTitle={
        <Button
          icon={<PlusCircleOutlined />}
          key={Math.random().toString()}
          type='primary'
          style={{ marginRight: '10px' }}
          onClick={() => handleAddAndEdit('add')}
        >
          新增推广任务
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
