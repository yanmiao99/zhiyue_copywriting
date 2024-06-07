import React, { useState, useRef } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Popconfirm, Form, Input, Space } from 'antd'
import GoldRecords from '@/components/GoldRecords'
import RechargeRecords from '@/components/RechargeRecords'
import TeacherIncomeRecords from '@/components/TeacherIncomeRecords'
import TeacherAuthDetail from '@/components/TeacherAuthDetail'

const { TextArea } = Input

export default () => {
  const { GetTeacherList, ChangeTeacherStatus, ChangeTeacherAuth, GetTeacherAuthDetails, GetTeacherIncomeDetails } =
    useModel('TeacherInfo')
  const { GetGoldDetail, GetRechargeDetail } = useModel('StudentOrParentInfo')
  const { BASE_COLOR } = useModel('Global')

  const { message, modal } = App.useApp()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码

  const tableRef = useRef()
  const [refuseReasonFormRef] = Form.useForm()

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
        getFn: () => GetRechargeDetail(params),
        template: res => <RechargeRecords data={res} />
      },
      goldCoin: {
        title: '金币记录',
        getFn: () => GetGoldDetail(params),
        template: res => <GoldRecords data={res} />
      },
      income: {
        title: '老师收益详情',
        getFn: () => GetTeacherIncomeDetails(params),
        template: res => <TeacherIncomeRecords data={res} />
      },
      auth: {
        title: '老师认证详情',
        getFn: () => GetTeacherAuthDetails(params),
        template: res => <TeacherAuthDetail data={res} />
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
      content: <div className='modal_wrapper'>{obj[type].template(res)}</div>
    })
  }

  // 更改状态
  const handleChangeStatus = async row => {
    let params = {
      userid: row.userid,
      status: row.forbidden === 1 ? 2 : 1
    }

    await ChangeTeacherStatus(params)
    tableRef.current.reload()
    message.success('操作成功')
  }

  // 拒绝原因
  const RefuseReason = () => {
    return (
      <Form preserve={false} form={refuseReasonFormRef} layout='vertical' name='refuseReason'>
        <Form.Item name='reason' label='拒绝原因: ' rules={[{ required: true, message: '请输入拒绝原因' }]}>
          <TextArea rows={4} placeholder='请输入拒绝原因' allowClear />
        </Form.Item>
      </Form>
    )
  }

  // 更改认证状态
  const handleChangeAuthStatus = async (type, row) => {
    let statusObj = {
      adopt: {
        status: 2 // 认证通过
      },
      refuse: {
        status: 1 // 认证拒绝
      }
    }

    let params = {
      userid: row.userid,
      status: statusObj[type].status
    }

    if (type === 'refuse') {
      modal.confirm({
        title: '认证拒绝原因',
        content: <RefuseReason />,
        okText: '确认',
        cancelText: '取消',
        maskClosable: true,
        onOk: async () => {
          await refuseReasonFormRef.validateFields()
          const { reason } = refuseReasonFormRef.getFieldsValue()
          params.reason = reason
          await ChangeTeacherAuth(params)
          message.success('操作成功')
          tableRef.current.reload()
        }
      })
    } else {
      await ChangeTeacherAuth(params)
      tableRef.current.reload()
      message.success('操作成功')
    }
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
          text: '封禁',
          status: 'Error'
        },
        2: {
          text: '被解封',
          status: 'Success'
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
      title: '老师认证详情',
      width: 120,
      hideInSearch: true,
      align: 'center',
      render: (_, row) => {
        return (
          <>
            <div style={{ color: '#999999' }}>{row.certifiedstatus === 0 && '待认证'}</div>
            <div style={{ color: '#DE4E50' }}>{row.certifiedstatus === 1 && '未通过认证'}</div>
            <div style={{ color: '#6ABB78' }}>{row.certifiedstatus === 2 && '认证通过'}</div>
            <Button type='link' style={{ color: BASE_COLOR }} onClick={() => handleCheckDetails('auth', row)}>
              查看详情
            </Button>
          </>
        )
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
      title: '老师收益详情',
      width: 120,
      hideInSearch: true,
      align: 'center',
      render: (_, row) => {
        return (
          <Button type='link' style={{ color: BASE_COLOR }} onClick={() => handleCheckDetails('income', row)}>
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
      width: 300,
      valueType: 'option',
      fixed: 'right',
      align: 'right',
      render: (_, row) => {
        return (
          <Space>
            <Popconfirm
              key='adopt'
              title='确定通过认证吗？'
              onConfirm={() => handleChangeAuthStatus('adopt', row)}
              okText='确认'
              cancelText='取消'
            >
              <Button type='primary' ghost>
                通过认证
              </Button>
            </Popconfirm>

            <Popconfirm
              key='refuse'
              title='确定拒绝认证吗？'
              onConfirm={() => handleChangeAuthStatus('refuse', row)}
              okText='确认'
              cancelText='取消'
            >
              <Button type='primary' ghost danger>
                拒绝认证
              </Button>
            </Popconfirm>

            <Popconfirm
              key='delete'
              title='确定更改状态吗？'
              onConfirm={() => handleChangeStatus(row)}
              okText='确认'
              cancelText='取消'
            >
              <Button type='primary' ghost danger={row.forbidden === 1}>
                {row.forbidden === 1 ? '解封' : '禁用'}
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
        const res = await GetTeacherList(param)
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
