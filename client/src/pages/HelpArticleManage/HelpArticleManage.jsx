import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Input, Popconfirm, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
const { TextArea } = Input

export default () => {
  const { GetQAList, AddQA, DeleteQA, CheckQADetail } = useModel('HelpArticleManage')

  const { message, modal } = App.useApp()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码

  const tableRef = useRef()

  const [addAndEditModalFormRef] = Form.useForm()

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
          <div
            style={{
              paddingTop: 10
            }}
          >
            <Form.Item
              style={{ paddingBottom: '10px' }}
              name='title'
              label='标题'
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder='请输入标题' allowClear />
            </Form.Item>
            <Form.Item
              style={{ paddingBottom: '10px' }}
              name='content'
              label='内容'
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <TextArea autoSize={{ minRows: 5, maxRows: 8 }} placeholder='请输入内容' allowClear />
            </Form.Item>
          </div>
        </Form>
      )
    }

    let typeObj = {
      add: {
        title: '新增',
        getFn: params => AddQA(params)
      },
      edit: {
        title: '编辑',
        getFn: params => AddQA(params)
      }
    }

    modal.confirm({
      title: typeObj[type].title,
      width: 600,
      icon: null,
      content: <AddAndEditModal />,
      onOk: async () => {
        await addAndEditModalFormRef.validateFields()

        let params = addAndEditModalFormRef.getFieldsValue()
        type === 'edit' && (params.id = row.id)

        await typeObj[type].getFn(params)
        tableRef.current.reload()
        message.success('操作成功')
      }
    })
  }

  const originColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center'
    },
    {
      title: '内容',
      dataIndex: 'content',
      align: 'center',
      width: 300
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      align: 'center'
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
            <Button type='primary' ghost onClick={() => handleAddAndEdit('edit', row)}>
              修改
            </Button>

            <Popconfirm
              title='确定删除吗？'
              onConfirm={async () => {
                await DeleteQA({ id: row.id })
                tableRef.current.reload()
                message.success('删除成功')
              }}
              okText='确定'
              cancelText='取消'
            >
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
        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)

        const res = await GetQAList(param)
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
          新增
        </Button>
      }
      scroll={{ x: 'max-content' }}
      rowKey='id'
      columns={originColumns}
      search={false}
    />
  )
}
