import React, { useState, useRef } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Input, Popconfirm, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import FormUploadImg from '@/components/FormUploadImg'

export default () => {
  const { BASE_COLOR } = useModel('Global')
  const { GetCategoryList, AddCategory, DeleteCategory, UpdateCategory } = useModel('CategoryManage')
  const { message, modal } = App.useApp()
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
      width: 600,
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

  const originColumns = [
    {
      title: '名称',
      dataIndex: 'text',
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
        return <img src={text} style={{ width: 50, height: 50 }} />
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
        const param = {
          page: params.current,
          limit: params.pageSize,
          ...params
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetCategoryList(param)

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
          icon={<PlusCircleOutlined />}
          onClick={() => handleAddAndEdit('add')}
          key={Math.random().toString()}
          type='primary'
        >
          新增分类
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
