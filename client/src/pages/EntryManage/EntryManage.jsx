import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Input, Popconfirm, Space, Select } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

export default () => {
  const { BASE_COLOR } = useModel('Global')
  const { GetCategoryDetailsList, AddCategoryDetails, DeleteCategoryDetails, UpdateCategoryDetails } =
    useModel('EntryManage')
  const { GetCategoryList } = useModel('CategoryManage')
  const { message, modal } = App.useApp()
  const [pageSize, setPageSize] = useState(5) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码
  const tableRef = useRef()

  const [addAndEditModalFormRef] = Form.useForm()

  const [categoryMap, setCategoryMap] = useState({}) // 分类映射表
  const [categoryList, setCategoryList] = useState({}) // 分类列表

  useEffect(() => {
    getCategoryListInfo()
  }, [])

  // 获取分类
  const getCategoryListInfo = async () => {
    const res = await GetCategoryList()

    // 使用 reduce 方法转换数组为对象
    const categoriesObject = res.list.reduce((obj, category) => {
      obj[category.id] = category.text
      return obj
    }, {})

    setCategoryMap(categoriesObject)

    const categoriesList = res.list.map(item => {
      return {
        label: item.text,
        value: item.id
      }
    })
    setCategoryList(categoriesList)
  }

  // 删除
  const handleDeleteItem = async row => {
    await DeleteCategoryDetails({
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
      // 自定义搜索
      const filterOption = (input, option) => {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }

      return (
        <Form
          preserve={false}
          form={addAndEditModalFormRef}
          name='addAndEditModal'
          initialValues={{}}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item name='categoryId' label='所属分类' rules={[{ required: true, message: '请选择所属分类' }]}>
            <Select
              showSearch
              filterOption={filterOption}
              allowClear
              disabled={type === 'edit'}
              placeholder='请选择所属分类'
            >
              {categoryList.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name='text' label='内容' rules={[{ required: true, message: '请输入内容' }]}>
            <Input.TextArea placeholder='请输入' allowClear autoSize={{ minRows: 3, maxRows: 5 }} />
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
        type === 'add' ? await AddCategoryDetails(params) : await UpdateCategoryDetails(params)

        tableRef.current.reload()
        message.success('操作成功')
      }
    })
  }

  const originColumns = [
    {
      title: '内容',
      dataIndex: 'text',
      width: 100,
      align: 'center'
    },
    {
      title: '所属分类',
      dataIndex: 'categoryId',
      width: 100,
      align: 'center',
      valueType: 'select',
      valueEnum: categoryMap,
      render: (_, row) => {
        return row.categoryTitle
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
        const res = await GetCategoryDetailsList(param)

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
          新增词条
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
