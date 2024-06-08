import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Input, Popconfirm, DatePicker, Space, Radio } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import FormUploadImg from '@/components/FormUploadImg'
import { getUserInfo } from '@/utils/utils'

export default () => {
  const { BASE_COLOR } = useModel('Global')
  const { GetUserList, RegisterUser, DeleteUser, UpdateUser } = useModel('UserManage')
  const { message, modal } = App.useApp()
  const [pageSize, setPageSize] = useState(5) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码
  const tableRef = useRef()

  const [addAndEditModalFormRef] = Form.useForm()

  // 删除
  const handleDeleteItem = async row => {
    // 判断当前账号是否和删除的一致
    if (row.id === getUserInfo().id) {
      message.error('不能删除账号自身')
      return
    }

    await DeleteUser({
      id: row.id
    })
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
          initialValues={{
            platform: 'server'
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item name='username' label='名称' rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder='请输入名称' allowClear />
          </Form.Item>
          {type === 'add' && (
            <>
              <Form.Item name='email' label='邮箱' rules={[{ required: true, message: '请输入邮箱' }]}>
                <Input placeholder='请输入邮箱' allowClear />
              </Form.Item>

              <Form.Item name='password' label='密码' rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password placeholder='请输入密码' allowClear />
              </Form.Item>
            </>
          )}

          <Form.Item name='platform' label='所属平台' rules={[{ required: true, message: '请选择所属平台' }]}>
            <Radio.Group>
              <Radio value='server'>后台</Radio>
              <Radio value='applet'>小程序</Radio>
              <Radio value='all'>全部</Radio>
            </Radio.Group>
          </Form.Item>

          {type === 'edit' && <FormUploadImg required name='avatar' label='头像' />}
        </Form>
      )
    }

    modal.confirm({
      title: type === 'add' ? '新增' : '编辑',
      width: 600,
      icon: null,
      content: <AddAndEditModal />,
      onOk: async () => {
        await addAndEditModalFormRef.validateFields()
        let params = addAndEditModalFormRef.getFieldsValue()
        if (type === 'edit') params.id = row.id

        params.type = 'server' // 表明是后台注册

        type === 'add' ? await RegisterUser(params) : await UpdateUser(params)

        tableRef.current.reload()
        message.success('操作成功')
      }
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
        applet: { text: '小程序', status: 'Warning' },
        all: { text: '全部', status: 'Processing' }
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
          新增用户
        </Button>
      }
      scroll={{ x: 'max-content' }}
      rowKey='id'
      columns={originColumns}
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
        span: 6
      }}
    />
  )
}
