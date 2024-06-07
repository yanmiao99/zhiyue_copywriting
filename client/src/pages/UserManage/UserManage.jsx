import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Input, Popconfirm, DatePicker, Space, Radio } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import UploadImgList from '@/components/UploadImgList'
import dayjs from 'dayjs'
import FormUploadImg from '@/components/FormUploadImg'

export default () => {
  const { GetUserList, AddCategory, DeleteCategory, UpdateCategory } = useModel('UserManage')
  const { message, modal } = App.useApp()
  const { BASE_COLOR } = useModel('Global')
  const [pageSize, setPageSize] = useState(5) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码
  const tableRef = useRef()

  const [addAndEditModalFormRef] = Form.useForm()

  // 删除
  const handleDeleteItem = async row => {
    await DeleteCategory({
      id: row.id
    })
    tableRef.current.reload()
    message.success('操作成功')
  }

  // 发送
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
        ...row
      })
    }

    const AddAndEditModal = () => {
      return (
        <Form
          preserve={false}
          form={addAndEditModalFormRef}
          name='addAndEditModal'
          initialValues={{}}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item name='text' label='名称' rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder='请输入名称' allowClear maxLength='5' />
          </Form.Item>

          <FormUploadImg required name='icon' label='图标' />
        </Form>
      )
    }

    modal.confirm({
      title: type === 'add' ? '新增' : '编辑',
      width: 400,
      icon: null,
      content: <AddAndEditModal />,
      onOk: async () => {
        await addAndEditModalFormRef.validateFields()
        let params = addAndEditModalFormRef.getFieldsValue()
        if (type === 'edit') params.id = row.id
        type === 'add' ? await AddCategory(params) : await UpdateCategory(params)

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
      content: 123,
      okText: '关闭'
    })
  }

  const originColumns = [
    {
      title: '名称',
      dataIndex: 'username',
      width: 100,
      align: 'center'
    },
    {
      title: '所属平台',
      dataIndex: 'platform',
      width: 100,
      align: 'center',
      valueEnum: {
        server: { text: '后台', status: 'Success' },
        applet: { text: '小程序', status: 'Warning' }
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 100,
      align: 'center'
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 100,
      hideInSearch: true,
      align: 'center',
      render: (text, row) => {
        const avatar = row.avatar ? row.avatar : 'https://qny.weizulin.cn/images/202406031006296.png'

        return <img src={avatar} style={{ width: 50, height: 50 }} />
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 100,
      align: 'center',
      hideInSearch: true,
      render: (text, row) => {
        return dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')
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
            <Button type='link' onClick={() => handleAddAndEdit('edit', row)}>
              编辑
            </Button>
            <Popconfirm title='确定要删除吗？' onConfirm={() => handleDeleteItem(row)}>
              <Button type='link' danger>
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
        const filters = {}
        const param = {
          page: params.current,
          limit: params.pageSize,
          ...params
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetUserList(param)

        console.log('res========', res)

        return {
          data: res.list,
          success: true,
          total: res.pagination.totalCount
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
          新增
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
