import React, { useState, useRef } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Popconfirm } from 'antd'
import GoldRecords from '@/components/GoldRecords'
import RechargeRecords from '@/components/RechargeRecords'

export default () => {
  const { GetStudentList, ChangeStudentStatus, GetGoldDetail, GetRechargeDetail } = useModel('StudentOrParentInfo')

  const { BASE_COLOR } = useModel('Global')

  const { message, modal } = App.useApp()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码

  const tableRef = useRef()

  // 查看详情
  const handleCheckDetails = async (type, row) => {
    let params = {
      userid: row.userid,
      offset: 0,
      step: 9999999
    }

    let obj = {
      recharge: {
        title: '充值记录',
        getFn: () => GetRechargeDetail(params)
      },
      goldCoin: {
        title: '金币记录',
        getFn: () => GetGoldDetail(params)
      }
    }

    const res = await obj[type].getFn()

    modal.info({
      title: obj[type].title,
      width: 650,
      maskClosable: true,
      style: { top: 20 },
      okText: '关闭',
      icon: null,
      content: (
        <div className='modal_wrapper'>
          {type === 'recharge' ? <RechargeRecords data={res} /> : <GoldRecords data={res} />}
        </div>
      )
    })
  }

  // 更改状态
  const handleChangeStatus = async row => {
    let params = {
      userid: row.userid,
      status: row.forbidden === 2 ? 1 : 2
    }

    await ChangeStudentStatus(params)
    tableRef.current.reload()
    message.success('操作成功')
  }

  const originColumns = [
    {
      title: 'ID',
      dataIndex: 'venusid',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '用户名称',
      dataIndex: 'nickname',
      width: 150,
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '注册时间',
      dataIndex: 'createtime',
      width: 200,
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 150,
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'forbidden',
      width: 80,
      align: 'center',
      valueEnum: {
        0: {
          text: '无状态',
          status: 'Processing'
        },
        1: {
          text: '解禁',
          status: 'Success'
        },
        2: {
          text: '被封禁',
          status: 'Error'
        }
      }
    },
    {
      title: '是否会员',
      dataIndex: 'membertype',
      width: 150,
      align: 'center',
      valueEnum: {
        0: {
          text: '普通人员',
          status: 'Processing'
        },
        1: {
          text: '星会员',
          status: 'Success'
        },
        2: {
          text: '超级星会员',
          status: 'Error'
        }
      }
    },
    {
      title: '充值/消费记录',
      width: 120,
      hideInSearch: true,
      align: 'center',
      render: (_, row) => {
        return (
          <Button type='link' style={{ color: BASE_COLOR }} onClick={() => handleCheckDetails('recharge', row)}>
            查看详情
          </Button>
        )
      }
    },
    {
      title: '金币/消费记录',
      width: 120,
      hideInSearch: true,
      align: 'center',
      render: (_, row) => {
        return (
          <Button type='link' style={{ color: BASE_COLOR }} onClick={() => handleCheckDetails('goldCoin', row)}>
            查看详情
          </Button>
        )
      }
    },
    {
      title: '输入ID/名称/手机号',
      hideInTable: true,
      dataIndex: 'option'
    },
    {
      title: '操作',
      key: 'option',
      width: 100,
      valueType: 'option',
      fixed: 'right',
      align: 'right',
      render: (_, row) => {
        return (
          <Popconfirm
            key='delete'
            title='确定更改状态吗？'
            onConfirm={() => handleChangeStatus(row)}
            okText='确认'
            cancelText='取消'
          >
            <Button type='primary' ghost danger={row.forbidden !== 2}>
              {row.forbidden !== 2 ? '禁用' : '解禁'}
            </Button>
          </Popconfirm>
        )
      }
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        const filters = {
          option: params.option,
          status: Number(params.forbidden),
          membertype: Number(params.membertype)
        }

        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          ...filters
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetStudentList(param)
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
      rowKey='userid'
      columns={originColumns}
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
        span: 12
      }}
    />
  )
}
