import React, { useState, useRef } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Input, Popconfirm, Space, InputNumber } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

export default () => {
  const { BASE_COLOR } = useModel('Global')
  const { GetMenuList, AddMenu, DeleteMenu, UpdateMenu } = useModel('MenuManage')
  const { message, modal } = App.useApp()
  const [pageSize, setPageSize] = useState(5) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码
  const tableRef = useRef()

  const [addAndEditModalFormRef] = Form.useForm()

  // 删除
  const handleDeleteItem = async row => {
    await DeleteMenu({
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
          initialValues={{}}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item extra='例: 测试名称' name='name' label='名称' rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder='请输入名称' allowClear maxLength='6' />
          </Form.Item>

          <Form.Item
            extra='例: icon-zhiyue-caidanguanli'
            name='icon'
            label='图标'
            rules={[{ required: true, message: '请输入图标' }]}
          >
            <Input placeholder='请输入图标' allowClear />
          </Form.Item>

          <Form.Item
            extra='例: /manage/MenuManage'
            name='path'
            label='路径'
            rules={[{ required: true, message: '请输入路径' }]}
          >
            <Input placeholder='请输入路径' allowClear />
          </Form.Item>

          <Form.Item name='sort' label='排序' rules={[{ required: true, message: '请输入排序' }]}>
            <Input placeholder='请输入排序' allowClear />
          </Form.Item>
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
        type === 'add' ? await AddMenu(params) : await UpdateMenu(params)

        tableRef.current.reload()
        message.success('操作成功')
      }
    })
  }

  const originColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 100,
      align: 'center'
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 100,
      hideInSearch: true,
      align: 'center',
      render: (text, row) => {
        return (
          <svg style={{ width: '30px', height: '30px' }} aria-hidden='true'>
            <use xlinkHref={`#${text}`}></use>
          </svg>
        )
      }
    },
    {
      title: '路径',
      dataIndex: 'path',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      align: 'center',
      hideInSearch: true
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
            <Button type='link' onClick={() => handleAddAndEdit('addSub', row)}>
              添加子菜单
            </Button>
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
        const param = {
          page: params.current,
          limit: params.pageSize,
          ...params
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetMenuList(param)

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
          新增菜单
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
