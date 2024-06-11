import React, { useState, useRef } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Input, Popconfirm, Space, InputNumber, Alert } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const btnType = {
  add: '新增',
  edit: '编辑',
  addSub: '新增子菜单',
  editSub: '编辑子菜单'
}

export default () => {
  const { BASE_COLOR } = useModel('Global')
  const { GetMenuList, AddMenu, DeleteMenu, UpdateMenu, GetSubMenuList, AddSubMenu, DeleteSubMenu, UpdateSubMenu } =
    useModel('MenuManage')
  const { message, modal } = App.useApp()

  // 一级菜单
  const tableRef = useRef()
  const [pageSize, setPageSize] = useState(5) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码

  // 二级菜单
  const twoTableRef = useRef()
  const [twoCurrentPage, setTwoCurrentPage] = useState(1) //  当前页码
  const [twoPageSize, setTwoPageSize] = useState(5) //  每页数量

  const [addAndEditModalFormRef] = Form.useForm()

  // 删除
  const handleDeleteItem = async (type, row) => {
    if (type === 'deleteSub') {
      await DeleteSubMenu({
        parentId: row.parentId,
        id: row.id
      })
    } else {
      await DeleteMenu({
        id: row.id
      })
    }
    tableRef.current.reload()
    message.success('操作成功')
  }

  // 添加/修改
  const handleAddAndEdit = async (type, row) => {
    if (type === 'edit' || type === 'editSub') {
      addAndEditModalFormRef.setFieldsValue({
        ...row
      })
    }

    // 添加/修改 表单
    const AddAndEditModal = () => {
      return (
        <>
          {type === 'addSub' && <Alert message='添加子菜单后,一级菜单将不可跳转,而是用于展开子菜单' type='info' />}
          <div
            style={{
              marginTop: '20px'
            }}
          >
            <Form
              preserve={false}
              form={addAndEditModalFormRef}
              name='addAndEditModal'
              initialValues={{}}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <Form.Item
                extra='例: 测试名称'
                name='name'
                label='名称'
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input placeholder='请输入名称' allowClear maxLength='6' />
              </Form.Item>

              {type === 'add' || type === 'edit' ? (
                <Form.Item
                  extra='例: icon-zhiyue-caidanguanli'
                  name='icon'
                  label='图标'
                  rules={[{ required: true, message: '请输入图标' }]}
                >
                  <Input placeholder='请输入图标' allowClear />
                </Form.Item>
              ) : null}

              <Form.Item
                extra={
                  type === 'editSub' || type === 'addSub'
                    ? '例: /manage/MenuManage'
                    : '例: /manage/MenuManage,如果需要子菜单,则直接使用 / 即可'
                }
                name='path'
                label='路径'
                rules={[{ required: true, message: '请输入路径' }]}
              >
                <Input placeholder='请输入路径' allowClear />
              </Form.Item>

              <Form.Item
                extra='数字越大越靠前'
                name='sort'
                label='排序'
                rules={[{ required: true, message: '请输入排序' }]}
              >
                <Input placeholder='请输入排序' allowClear />
              </Form.Item>
            </Form>
          </div>
        </>
      )
    }

    modal.confirm({
      title: `${btnType[type]}`,
      width: 600,
      icon: null,
      content: <AddAndEditModal />,
      onOk: async () => {
        await addAndEditModalFormRef.validateFields()
        let params = addAndEditModalFormRef.getFieldsValue()

        if (type === 'addSub' || type === 'editSub') {
          if (type === 'addSub') {
            params.parentId = row.id
            await AddSubMenu(params)
          } else {
            params.id = row.id
            params.parentId = row.parentId
            await UpdateSubMenu(params)
          }
        } else if (type === 'add' || type === 'edit') {
          if (type === 'edit') params.id = row.id
          type === 'add' ? await AddMenu(params) : await UpdateMenu(params)
        }

        tableRef.current.reload()
        message.success('操作成功')
      }
    })
  }

  const originColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
      align: 'left',
      render: (text, row) => {
        return row.parentId === 0 ? <b style={{ color: BASE_COLOR }}>{text}</b> : text
      }
    },
    {
      title: '图标',
      dataIndex: 'icon',
      width: 100,
      hideInSearch: true,
      align: 'center',
      render: (text, row) => {
        return (
          <>
            {row.parentId === 0 ? (
              <svg style={{ width: '30px', height: '30px' }} aria-hidden='true'>
                <use xlinkHref={`#${text}`}></use>
              </svg>
            ) : (
              '/'
            )}
          </>
        )
      }
    },
    {
      title: '路径',
      dataIndex: 'path',
      width: 100,
      align: 'left',
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
      width: 200,
      dataIndex: 'createdAt',
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
            {row.parentId === 0 && (
              <Button type='link' onClick={() => handleAddAndEdit('addSub', row)}>
                添加子菜单
              </Button>
            )}
            <Button type='link' onClick={() => handleAddAndEdit(row.parentId === 0 ? 'edit' : 'editSub', row)}>
              编辑
            </Button>
            <Popconfirm
              title='确定要删除吗？'
              onConfirm={() => handleDeleteItem(row.parentId === 0 ? 'delete' : 'deleteSub', row)}
            >
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
          icon={<PlusCircleOutlined />}
          onClick={() => handleAddAndEdit('add')}
          key={Math.random().toString()}
          type='primary'
        >
          新增菜单
        </Button>
      }
      scroll={{ x: 'max-content' }}
      rowKey={row => {
        return row.id
      }}
      columns={originColumns}
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
        span: 12
      }}
    />
  )
}
