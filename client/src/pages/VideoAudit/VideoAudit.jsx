import React, { useState, useRef } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Popconfirm, Space, Input, Tag } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import DetailsRow from '@/components/DetailsRow'

const { TextArea } = Input

export default () => {
  const { GetVideoList, ChangeVideoStatus, GetItemVideoDetails } = useModel('VideoAudit')

  const { BASE_COLOR } = useModel('Global')

  const { message, modal } = App.useApp()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码

  const tableRef = useRef()

  // 选择行
  const [currentSelectedRowKeys, setCurrentSelectedRowKeys] = useState([])

  const [refuseReasonFormRef] = Form.useForm()

  // 批量更改状态
  const handleSelectChange = (selectedRowKeys, selectedRows) => {
    setCurrentSelectedRowKeys(selectedRowKeys)
  }

  // 查看详情
  const handleCheckDetails = async row => {
    const res = await GetItemVideoDetails(row.id)
    const Detail = () => {
      return (
        <div className='modal_wrapper'>
          <DetailsRow title={'标题'}>{<div>{res.title}</div>}</DetailsRow>
          <DetailsRow title={'标签'}>
            {res.tags.map(item => {
              return (
                <Tag color='blue' key={item}>
                  {item}
                </Tag>
              )
            })}
          </DetailsRow>
          <DetailsRow title={'审核时间'}>{res.confirmtime ? res.confirmtime : '--'}</DetailsRow>
          <DetailsRow title={'上传时间'}>{res.createtime}</DetailsRow>
          <DetailsRow title={'视频内容'}>{<div>{res.introduce}</div>}</DetailsRow>
          <DetailsRow title={'审核状态'}>
            {
              <div>
                <span style={{ color: '#999999' }}>{row.status === 1 && '草稿'}</span>
                <span style={{ color: '#E7AB2F' }}>{row.status === 2 && '审核中'}</span>
                <span style={{ color: '#80C336' }}>{row.status === 3 && '审核通过'}</span>
                <span style={{ color: '#DE4E50' }}>{row.status === 4 && '审核未通过'}</span>
              </div>
            }
          </DetailsRow>
          <DetailsRow title={'视频'}>
            <video src={res.videourl} controls />
          </DetailsRow>
        </div>
      )
    }

    modal.info({
      title: '视频详情',
      width: 600,
      maskClosable: true,
      style: { top: 20 },
      okText: '关闭',
      icon: null,
      content: <Detail />
    })
  }

  // 更改状态
  const handleChangeStatus = async (type, row) => {
    changeStatus(type, [row.id])
  }

  // 批量更改状态
  const handleBatchChangeStatus = async (type, ids) => {
    if (!ids.length) {
      message.error('请最少选择一条需要操作的数据')
      return
    }
    changeStatus(type, ids)
  }

  const RefuseReason = () => {
    return (
      <Form preserve={false} form={refuseReasonFormRef} layout='vertical' name='refuseReason'>
        <Form.Item name='reason' label='拒绝原因: ' rules={[{ required: true, message: '请输入拒绝原因' }]}>
          <TextArea rows={4} placeholder='请输入拒绝原因' allowClear />
        </Form.Item>
      </Form>
    )
  }

  // 通用更改状态方法
  const changeStatus = async (type, ids) => {
    let typeObj = {
      adopt: {
        title: '通过',
        status: 3 // 审核通过
      },
      refuse: {
        title: '拒绝',
        status: 4 // 审核未通过
      }
    }

    let params = {
      ids: ids,
      status: typeObj[type].status
    }

    if (type === 'refuse') {
      modal.confirm({
        title: '拒绝原因',
        content: <RefuseReason />,
        okText: '确认',
        cancelText: '取消',
        maskClosable: true,
        onOk: async () => {
          await refuseReasonFormRef.validateFields()
          const { reason } = refuseReasonFormRef.getFieldsValue()
          params.reason = reason
          await ChangeVideoStatus(params)
          message.success('操作成功')
          tableRef.current.reload()
        }
      })
    } else {
      await ChangeVideoStatus(params)
      tableRef.current.reload()
      message.success('操作成功')
    }
  }

  const originColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '用户名称',
      dataIndex: 'nickname',
      width: 150,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '视频名称',
      dataIndex: 'title',
      width: 150,
      align: 'center'
    },
    {
      title: '上传课程详情',
      width: 120,
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
      title: '状态',
      dataIndex: 'status',
      width: 120,
      align: 'center',
      hideInSearch: true,
      valueEnum: {
        1: {
          text: '草稿',
          status: 'Warning'
        },
        2: {
          text: '审核中',
          status: 'Processing'
        },
        3: {
          text: '审核通过',
          status: 'Success'
        },
        4: {
          text: '审核未通过',
          status: 'Error'
        }
      }
    },
    {
      title: '备注',
      dataIndex: 'introduce',
      width: 150,
      hideInSearch: true,
      align: 'center',
      ellipsis: true
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
          <Space>
            {row.status !== 1 && (
              <>
                <Popconfirm
                  key='adopt'
                  title='确定通过审核吗？'
                  onConfirm={() => handleChangeStatus('adopt', row)}
                  okText='确认'
                  cancelText='取消'
                  disabled={row.status === 3}
                >
                  <Button type='primary' ghost disabled={row.status === 3}>
                    通过
                  </Button>
                </Popconfirm>
                <Popconfirm
                  key='refuse'
                  title='确定拒绝审核吗？'
                  onConfirm={() => handleChangeStatus('refuse', row)}
                  okText='确认'
                  cancelText='取消'
                  disabled={row.status === 4}
                >
                  <Button type='primary' ghost danger disabled={row.status === 4}>
                    拒绝
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>
        )
      }
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      rowSelection={{
        selectedRowKeys: currentSelectedRowKeys,
        onChange: handleSelectChange
      }}
      request={async params => {
        const filters = {
          title: params.title
        }

        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          sortk: '-updatetime',
          ...filters
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetVideoList(param)
        const { list, total } = res
        setCurrentSelectedRowKeys([])

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
      // scroll={{ x: 'max-content' }}
      rowKey='id'
      columns={originColumns}
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
        span: 12
      }}
      headerTitle={
        <Space>
          <Popconfirm
            key='batchAdopt'
            title='确定批量通过吗？'
            onConfirm={() => handleBatchChangeStatus('adopt', currentSelectedRowKeys)}
            okText='确认'
            cancelText='取消'
          >
            <Button type='primary'>
              <CheckCircleOutlined />
              批量通过
            </Button>
          </Popconfirm>
          <Popconfirm
            key='batchRefuse'
            title='确认批量拒绝吗？'
            onConfirm={() => handleBatchChangeStatus('refuse', currentSelectedRowKeys)}
            okText='确认'
            cancelText='取消'
          >
            <Button danger type='primary'>
              <CloseCircleOutlined /> 批量拒绝
            </Button>
          </Popconfirm>
        </Space>
      }
    />
  )
}
