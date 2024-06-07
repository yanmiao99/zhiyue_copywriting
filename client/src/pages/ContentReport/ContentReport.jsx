import React, { useState, useRef } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Popconfirm, Image, Form, Input, Select } from 'antd'
import DetailsRow from '@/components/DetailsRow'

const { TextArea } = Input

export default () => {
  const { GetReportList, ChangeReportStatus, GetItemReportDetails } = useModel('ContentReport')

  const { BASE_COLOR } = useModel('Global')

  const { message, modal } = App.useApp()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码

  const tableRef = useRef()

  const [reasonFormRef] = Form.useForm()

  // 查看详情
  const handleCheckDetails = async row => {
    const res = await GetItemReportDetails(row.id)
    console.log(res)

    const Detail = () => {
      return (
        <div className='details_wrapper'>
          <DetailsRow title={'举报类型'}>
            <div className='details_desc'>{res.Tag}</div>
          </DetailsRow>

          <DetailsRow title={'举报描述'}>
            <div className='details_desc'>{res.desc}</div>
          </DetailsRow>

          {res.images.length && (
            <DetailsRow title={'图片证据'}>
              {res.images.forEach(item => {
                return (
                  <Image
                    width={150}
                    height={150}
                    src={item}
                    style={{ borderRadius: '5px' }}
                    fallback='data:image/png;base64,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'
                  />
                )
              })}
            </DetailsRow>
          )}
        </div>
      )
    }

    modal.info({
      title: '举报详情',
      width: 600,
      maskClosable: true,
      icon: null,
      content: <Detail />,
      okText: '关闭'
    })
  }

  // 原因
  const Reason = () => {
    return (
      <Form
        preserve={false}
        form={reasonFormRef}
        layout='vertical'
        name='reason'
        initialValues={{
          tousertype: 3
        }}
      >
        <Form.Item name='tousertype' label='告知人员: ' rules={[{ required: true, message: '请选择告知人员' }]}>
          <Select
            placeholder='请选择需要告知人员'
            options={[
              { value: 1, label: '学生' },
              { value: 2, label: '老师' },
              { value: 3, label: '全部' }
            ]}
          />
        </Form.Item>
        <Form.Item name='content' label='原因: ' rules={[{ required: true, message: '请输入原因' }]}>
          <TextArea rows={4} placeholder='请输入原因' allowClear />
        </Form.Item>
      </Form>
    )
  }

  // 通过/拒绝 处理方法
  const handleAdoptOrRefuse = async (type, params) => {
    if (type === 'delete') {
      modal.confirm({
        title: params.status === 5 ? '恢复内容通知' : '违规内容删除通知',
        content: <Reason />,
        okText: '确认',
        cancelText: '取消',
        icon: null,
        maskClosable: true,
        onOk: async () => {
          await reasonFormRef.validateFields()
          const { content, tousertype } = reasonFormRef.getFieldsValue()
          params.tousertype = tousertype
          params.content = content
          await ChangeReportStatus(params)
          message.success('操作成功')
          tableRef.current.reload()
        }
      })
    } else {
      await ChangeReportStatus(params)
      tableRef.current.reload()
      message.success('操作成功')
    }
  }

  // 更改状态
  const handleChangeStatus = async (type, row) => {
    let params = {
      id: row.id
    }
    let obj = {
      relieve: 3,
      ban: 2,
      delete: row.status === 4 ? 5 : 4
    }
    params.status = obj[type]

    await handleAdoptOrRefuse(type, params)
  }

  const originColumns = [
    {
      title: '被举报用户手机号',
      dataIndex: 'reportedphone',
      width: 150,
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '举报者手机号',
      dataIndex: 'phone',
      width: 150,
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '举报类型',
      dataIndex: 'Tag',
      width: 200
    },
    {
      title: '举报时间',
      dataIndex: 'createtime',
      width: 200
    },
    {
      title: '举报内容',
      dataIndex: 'desc',
      width: 200
    },
    {
      title: '举报详情',
      width: 100,
      hideInSearch: true,
      align: 'center',
      render: (_, row) => {
        return (
          <Button type='link' style={{ color: BASE_COLOR }} onClick={() => handleCheckDetails(row)}>
            查看详情
          </Button>
        )
      }
    },
    {
      title: '举报来源',
      dataIndex: 'entitytype',
      width: 100,
      align: 'center',
      valueEnum: {
        note: {
          text: '笔记',
          status: 'Processing'
        },
        video: {
          text: '视频',
          status: 'Success'
        },
        course: {
          text: '课程',
          status: 'Warning'
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 150,
      valueEnum: {
        0: {
          text: '未知',
          status: 'Default'
        },
        1: {
          text: '未处理',
          status: 'Processing'
        },
        2: {
          text: '被封禁',
          status: 'Error'
        },
        3: {
          text: '解除封禁',
          status: 'Warning'
        },
        4: {
          text: '被删除',
          status: 'Error'
        },
        5: {
          text: '删除后恢复',
          status: 'Success'
        }
      }
    },
    {
      title: '被举报用户ID',
      dataIndex: 'reporteduserid',
      width: 200,
      hideInSearch: true
    },
    {
      title: '举报用户ID',
      dataIndex: 'userid',
      width: 200,
      hideInSearch: true
    },
    {
      title: '操作',
      key: 'option',
      width: 250,
      valueType: 'option',
      fixed: 'right',
      align: 'right',
      render: (_, row) => {
        return (
          <>
            <div>
              <Popconfirm
                key='relieve'
                title='确定更改状态吗？'
                onConfirm={() => handleChangeStatus('relieve', row)}
                okText='确认'
                cancelText='取消'
              >
                <Button type='primary' ghost style={{ marginRight: '10px' }}>
                  解除
                </Button>
              </Popconfirm>

              <Popconfirm
                key='ban'
                title='确定更改状态吗？'
                onConfirm={() => handleChangeStatus('ban', row)}
                okText='确认'
                cancelText='取消'
              >
                <Button type='primary' ghost style={{ marginRight: '10px' }} danger>
                  封禁
                </Button>
              </Popconfirm>

              <Popconfirm
                key='delete'
                title='确定更改状态吗？'
                onConfirm={() => handleChangeStatus('delete', row)}
                okText='确认'
                cancelText='取消'
              >
                <Button type='primary' ghost danger={row.status !== 4}>
                  {row.status === 4 ? '恢复' : '删除'}
                </Button>
              </Popconfirm>
            </div>
          </>
        )
      }
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        const filters = {
          desc: params.desc,
          tag: params.Tag,
          entitytype: params.entitytype,
          status: Number(params.status)
        }

        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          sortk: '-updatetime',
          ...filters
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetReportList(param)
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
