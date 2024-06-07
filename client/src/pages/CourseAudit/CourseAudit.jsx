import React, { useState, useRef } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Popconfirm, Space, Input, Tag } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import DetailsRow from '@/components/DetailsRow'

const { TextArea } = Input

export default () => {
  const { GetCourseList, ChangeCourseStatus, GetItemCourseDetails, GetChaptersList, GetLessonsList } =
    useModel('CourseAudit')

  const { BASE_COLOR, setIsLoading } = useModel('Global')

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
    setIsLoading(true)
    const res = await GetItemCourseDetails(row.id)

    let courseList = []

    const chaptersRes = await GetChaptersList(res.id)
    for (const item of chaptersRes.list) {
      const lessonsRes = await GetLessonsList(item.id)
      courseList.push({
        title: item.title,
        list: lessonsRes.list
      })
    }

    setIsLoading(false)

    const Detail = () => {
      return (
        <div className='modal_wrapper'>
          <DetailsRow title={'标题'}>{<div>{res.title}</div>}</DetailsRow>
          <DetailsRow title={'课程分类'}>
            <Tag color='blue'>{res.classify}</Tag>
          </DetailsRow>
          <DetailsRow title={'上传完成时间'}>{<div>{res.confirmtime}</div>}</DetailsRow>
          <DetailsRow title={'视频介绍'}>{<div>{res.introduce}</div>}</DetailsRow>
          {courseList.map((chapterItem, chapterIndex) => {
            return (
              <div key={chapterIndex} style={{ border: '1px solid #ccc', marginBottom: '10px', borderRadius: '6px' }}>
                <DetailsRow title={'章名称'}>
                  <div>{chapterItem.title}</div>
                </DetailsRow>

                {chapterItem.list &&
                  chapterItem.list.map(sectionItem => {
                    return (
                      <DetailsRow title={'节名称'} key={sectionItem.id}>
                        <div style={{ marginBottom: '10px' }}>
                          <span style={{ marginRight: '10px' }}>{sectionItem.title}</span>
                          <span style={{ color: '#999999' }}>{sectionItem.status === 1 && '草稿'}</span>
                          <span style={{ color: '#E7AB2F' }}>{sectionItem.status === 2 && '审核中'}</span>
                          <span style={{ color: '#80C336' }}>{sectionItem.status === 3 && '审核通过'}</span>
                          <span style={{ color: '#DE4E50' }}>{sectionItem.status === 4 && '审核未通过'}</span>
                        </div>

                        <div>
                          <video src={sectionItem.videourl} controls />
                        </div>
                      </DetailsRow>
                    )
                  })}
              </div>
            )
          })}
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
          await ChangeCourseStatus(params)
          message.success('操作成功')
          tableRef.current.reload()
        }
      })
    } else {
      await ChangeCourseStatus(params)
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
      title: '课程名称',
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
        let isDisabled = row.status === 3 || row.status === 4
        return (
          <Space>
            <Popconfirm
              key='adopt'
              title='确定通过审核吗？'
              onConfirm={() => handleChangeStatus('adopt', row)}
              okText='确认'
              cancelText='取消'
              disabled={isDisabled}
            >
              <Button type='primary' ghost disabled={isDisabled}>
                通过
              </Button>
            </Popconfirm>
            <Popconfirm
              key='refuse'
              title='确定拒绝审核吗？'
              onConfirm={() => handleChangeStatus('refuse', row)}
              okText='确认'
              cancelText='取消'
              disabled={isDisabled}
            >
              <Button type='primary' ghost danger disabled={isDisabled}>
                拒绝
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
      rowSelection={{
        selectedRowKeys: currentSelectedRowKeys,
        onChange: handleSelectChange
      }}
      request={async params => {
        const filters = {
          title: params.title,
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
        const res = await GetCourseList(param)
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