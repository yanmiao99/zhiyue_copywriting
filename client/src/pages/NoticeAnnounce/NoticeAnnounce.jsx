import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Input, Popconfirm, DatePicker, Space, Radio } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import NoticeDetailsModal from './NoticeDetailsModal/NoticeDetailsModal'
import UploadImgList from '@/components/UploadImgList'
import dayjs from 'dayjs'
import FormUploadImg from '@/components/FormUploadImg'

const normFile = e => {
  if (e && e.length) {
    let arr = []
    e.forEach(item => {
      if (item.value) {
        arr.push(item.value)
      } else {
        return []
      }
    })

    return arr
  } else {
    return []
  }
}

export default () => {
  const { GetAnnouncementList, DeleteAnnouncementItem, AddAndEditAnnouncement, SendAnnouncementNotify } =
    useModel('NoticeAnnounce')
  const { message, modal } = App.useApp()
  const { BASE_COLOR } = useModel('Global')
  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码
  const tableRef = useRef()

  const [addAndEditModalFormRef] = Form.useForm()

  // 删除公告
  const handleDeleteItem = async row => {
    await DeleteAnnouncementItem(row.id)
    tableRef.current.reload()
    message.success('操作成功')
  }

  // 发送公告
  const handleSendItem = async row => {
    const params = {
      ids: [row.id],
      status: 1
    }
    await SendAnnouncementNotify(params)
    tableRef.current.reload()
    message.success('操作成功')
  }

  // 添加/修改
  const handleAddAndEdit = async (type, row) => {
    if (type === 'edit') {
      addAndEditModalFormRef.setFieldsValue({
        ...row,
        starttime: dayjs(row.starttime)
      })
    }

    const AddAndEditModal = () => {
      return (
        <Form
          preserve={false}
          form={addAndEditModalFormRef}
          name='addAndEditModal'
          initialValues={{
            tousertype: 3,
            starttime: dayjs()
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item name='title' label='通知公告名称' rules={[{ required: true, message: '请输入通知公告名称' }]}>
            <Input placeholder='请输入通知公告名称' allowClear />
          </Form.Item>

          <Form.Item
            name='starttime'
            label='通知公告开始时间'
            rules={[{ required: true, message: '请选择通知公告开始时间' }]}
          >
            <DatePicker showTime format='YYYY-MM-DD HH:mm:ss' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name='tousertype' label='通知人员' rules={[{ required: true, message: '请选择需要通知的人员' }]}>
            <Radio.Group>
              <Radio value={1}>学生</Radio>
              <Radio value={2}>老师</Radio>
              <Radio value={3}>全部</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name='images'
            label='通知图片'
            rules={[{ required: true, message: '请上传通知图片' }]}
            getValueFromEvent={normFile}
          >
            <UploadImgList />
          </Form.Item>

          <FormUploadImg required name='content' label='通知内容' />
        </Form>
      )
    }

    modal.confirm({
      title: type === 'add' ? '新增通知公告' : '编辑通知公告',
      width: 600,
      icon: null,
      content: <AddAndEditModal />,
      onOk: async () => {
        await addAndEditModalFormRef.validateFields()
        let params = addAndEditModalFormRef.getFieldsValue()
        params.starttime = dayjs(params.starttime).format('YYYY-MM-DD HH:mm:ss')
        if (type === 'edit') params.id = row.id
        await AddAndEditAnnouncement(params)
        tableRef.current.reload()
        message.success('操作成功')
      }
    })
  }

  // 查看详情
  const handleCheckDetails = async row => {
    modal.info({
      title: '通知详情',
      width: 600,
      maskClosable: true,
      icon: null,
      content: <NoticeDetailsModal deleteId={row.id} />,
      okText: '关闭'
    })
  }

  const originColumns = [
    {
      title: '通知公告名称',
      dataIndex: 'title',
      width: 100,
      align: 'center'
    },
    {
      title: '通知公告开始时间',
      dataIndex: 'starttime',
      width: 150,
      align: 'center',
      valueType: 'dateTime',
      render: (_, row) => {
        return <div>{dayjs(row.starttime).format('YYYY-MM-DD HH:mm:ss')}</div>
      }
      // search: {
      //   transform: value => {
      //     return {
      //       starttime: value[0],
      //       endtime: value[1]
      //     }
      //   }
      // }
    },
    {
      title: '通知人员',
      dataIndex: 'tousertype',
      width: 150,
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
          text: '全部',
          status: 'Processing'
        }
      }
    },
    {
      title: '通知详情',
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
      dataIndex: 'notifystatus',
      width: 80,
      align: 'center',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '待发送',
          status: 'Warning'
        },
        1: {
          text: '已发送',
          status: 'Success'
        }
      }
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
          <Space>
            {row.notifystatus !== 1 && (
              <Popconfirm title='确定发送公告吗?' onConfirm={() => handleSendItem(row)}>
                <Button type='primary' ghost>
                  发送
                </Button>
              </Popconfirm>
            )}
            <Button type='primary' ghost onClick={() => handleAddAndEdit('edit', row)}>
              编辑
            </Button>
            <Popconfirm title='确定要删除吗？' onConfirm={() => handleDeleteItem(row)}>
              <Button type='primary' ghost danger>
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
          starttime: params.starttime,
          endtime: params.endtime,
          tousertype: Number(params.tousertype),
          title: params.title
        }

        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          ...filters
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetAnnouncementList(param)
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
      headerTitle={
        <Button
          icon={<PlusOutlined />}
          onClick={() => handleAddAndEdit('add')}
          key={Math.random().toString()}
          type='primary'
        >
          新增通知公告
        </Button>
      }
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
