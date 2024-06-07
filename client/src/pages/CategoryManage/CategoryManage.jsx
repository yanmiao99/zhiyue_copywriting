/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react'
import { ProTable } from '@ant-design/pro-components'
import { Button, Popconfirm, Modal, Form, Input, Radio, InputNumber, Image, Switch, App } from 'antd'
import { useModel } from '@umijs/max'
import { EditTwoTone, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

export default () => {
  const {
    GetCourseCategoryList,
    GetClassifyList,
    AddClassify,
    AddCategory,
    DeleteCategory,
    DeleteClassify,
    GetUseasList
  } = useModel('CategoryManage')

  const { message, modal } = App.useApp()

  // 一级分类
  const tableRef = useRef()
  const [currentPage, setCurrentPage] = useState(1) //  当前页码
  const [pageSize, setPageSize] = useState(10) //  每页数量

  // 二级分类
  const twoTableRef = useRef()
  const [twoCurrentPage, setTwoCurrentPage] = useState(1) //  当前页码
  const [twoPageSize, setTwoPageSize] = useState(5) //  每页数量

  const [formRef] = Form.useForm() // 表单

  // tab 选项卡
  const [tabActiveKey, setTabActiveKey] = useState('all')
  const [tabList, setTabList] = useState([])

  useEffect(() => {
    handleGetTabList()
  }, [])

  // 获取tab列表
  const handleGetTabList = async () => {
    const res = await GetUseasList()
    const data = res.list.map(item => {
      return {
        key: item.key,
        tab: item.alias
      }
    })
    setTabList(data)
  }

  // 处理 tab 切换
  const handleTabActive = key => {
    setTabActiveKey(key)
    setCurrentPage(1)
    tableRef.current.reload()
  }

  // 删除
  const handleDelete = async (type, row) => {
    const typeMap = {
      detail: {
        title: '删除一级分类',
        fn: params => DeleteCategory(params),
        params: {
          categoryid: row.id
        },
        refresh() {
          tableRef.current.reload()
        }
      },
      detail_sub: {
        title: '删除子分类',
        params: {
          id: row.id
        },
        fn: params => DeleteClassify(params),
        refresh() {
          twoTableRef.current.reload()
        }
      }
    }

    const params = typeMap[type].params

    const res = await typeMap[type].fn(params)
    if (res) {
      message.success('操作成功')
      typeMap[type].refresh()
    }
  }

  // 新增/编辑
  const handleAddAndEdit = async (type, row = {}) => {
    const useas = tabActiveKey

    const typeMap = {
      add: {
        title: '新建一级分类',
        name: 'category',
        params: {
          category: '',
          sortkey: 1,
          status: 1,
          useas
        },
        fn: params => AddCategory(params),
        refresh() {
          tableRef.current.reload()
        }
      },
      edit: {
        title: '编辑一级分类',
        name: 'category',
        params: {
          id: row.id,
          category: row.category,
          sortkey: row.sortkey,
          status: row.status,
          useas
        },
        fn: params => AddCategory(params),
        refresh() {
          tableRef.current.reload()
        }
      },

      add_sub: {
        title: '新建子分类',
        name: 'classify',
        params: {
          categoryid: row.id,
          classify: '',
          sortkey: 1,
          status: 1,
          useas
        },
        fn: params => AddClassify(params),
        refresh() {
          twoTableRef.current.reload()
        }
      },
      edit_sub: {
        title: '编辑子分类',
        name: 'classify',
        params: {
          id: row.id,
          categoryid: row.categoryid,
          classify: row.classify,
          sortkey: row.sortkey,
          status: row.status,
          useas
        },
        fn: params => AddClassify(params),
        refresh() {
          twoTableRef.current.reload()
        }
      }
    }

    let params = typeMap[type].params

    formRef.setFieldsValue(params)

    modal.confirm({
      icon: null,
      title: typeMap[type].title,
      content: (
        <Form form={formRef}>
          <Form.Item label='名称' name={typeMap[type].name} rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder='请输入' allowClear />
          </Form.Item>
          <Form.Item label='排序' name='sortkey' rules={[{ required: true, message: '请输入排序' }]}>
            <InputNumber placeholder='请输入' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label='状态' name='status' rules={[{ required: true, message: '请选择状态' }]}>
            <Radio.Group>
              <Radio value={1}>启动</Radio>
              <Radio value={0}>禁用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        await formRef.validateFields()
        let params = typeMap[type].params
        const values = formRef.getFieldsValue()

        const res = await typeMap[type].fn({
          ...params,
          ...values
        })

        if (res) {
          message.success('操作成功')
          typeMap[type].refresh()
        }
      }
    })
  }

  // 二级分类
  const expandedRowRender = record => {
    return (
      <ProTable
        actionRef={twoTableRef}
        request={async params => {
          const param = {
            offset: params.current * params.pageSize - params.pageSize,
            step: params.pageSize,
            categoryid: record.id,
            useas: tabActiveKey
          }

          setTwoCurrentPage(params.current)
          setTwoPageSize(params.pageSize)

          const res = await GetClassifyList(param)

          let arr = []
          res.list.forEach(item => {
            arr.push({
              ...item,
              cate_pid: record.id
            })
          })

          return {
            data: arr,
            success: true,
            total: res.total
          }
        }}
        pagination={{
          pageSize: twoPageSize,
          current: twoCurrentPage
        }}
        rowKey='id'
        scroll={{ x: 'max-content' }}
        columns={columns}
        headerTitle={false}
        search={false}
        options={false}
      />
    )
  }

  const columns = [
    {
      title: '分类名称',
      width: 120,
      align: 'center',
      hideInSearch: true,
      render: (text, record) => {
        {
          return record.cate_pid === 0 ? (
            <div style={{ fontWeight: '500', color: '#1677ff' }}>{record.category}</div>
          ) : (
            <div>{record.classify}</div>
          )
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      align: 'center',
      hideInSearch: true,
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '禁用', status: 'Error' }
      }
    },
    {
      title: '排序',
      dataIndex: 'sortkey',
      width: 110,
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      width: 150,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      key: 'option',
      width: 150,
      valueType: 'option',
      align: 'right',
      render: (_, row, index, action) => {
        return (
          <>
            {
              <>
                {row.cate_pid === 0 && (
                  <Button type='link' key='add_sub' onClick={() => handleAddAndEdit('add_sub', row)}>
                    新建子分类
                  </Button>
                )}
                <Button
                  type='link'
                  key='edit'
                  onClick={() => handleAddAndEdit(row.cate_pid === 0 ? 'edit' : 'edit_sub', row)}
                >
                  编辑
                </Button>

                <Popconfirm
                  key='delete'
                  title='是否确认删除该分类？'
                  onConfirm={() => handleDelete(row.cate_pid === 0 ? 'detail' : 'detail_sub', row)}
                  okText='确认'
                  cancelText='取消'
                >
                  <Button type='link' danger>
                    删除
                  </Button>
                </Popconfirm>
              </>
            }
          </>
        )
      }
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      expandable={{
        expandedRowRender: record => expandedRowRender(record)
      }}
      toolbar={{
        multipleLine: true,
        tabs: {
          activeKey: tabActiveKey,
          onChange: key => handleTabActive(key),
          items: tabList
        }
      }}
      request={async params => {
        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          useas: tabActiveKey
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)

        const fatherRes = await GetCourseCategoryList(param)

        let res = []
        fatherRes.list.forEach(item => {
          res.push({
            ...item,
            cate_pid: 0
          })
        })

        return {
          data: res,
          success: true,
          total: fatherRes.total
        }
      }}
      pagination={{
        pageSize: pageSize,
        current: currentPage
      }}
      rowKey='id'
      scroll={{ x: 'max-content' }}
      columns={columns}
      headerTitle={
        <Button
          icon={<PlusOutlined />}
          key={Math.random().toString()}
          type='primary'
          onClick={() => handleAddAndEdit('add')}
        >
          新建一级分类
        </Button>
      }
      search={false}
    />
  )
}
