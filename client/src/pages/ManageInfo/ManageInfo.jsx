import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Input, Popconfirm, Radio, Select, Switch } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { encryptPassword } from '@/utils/utils'

export default () => {
  const { GetManageList, ChangeManageStatus, CreateManageUser, UpdateManageUser } = useModel('ManageInfo')

  const { message, modal } = App.useApp()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码

  const tableRef = useRef()

  const [addAndEditModalFormRef] = Form.useForm()

  // 更改状态
  const handleChangeStatus = async row => {
    let params = {
      userid: row.userid,
      status: row.forbidden === 1 ? 2 : 1
    }

    await ChangeManageStatus(params)
    tableRef.current.reload()
    message.success('操作成功')
  }

  // 添加/修改
  const handleAddAndEdit = async (type, row) => {
    if (type === 'edit') {
      addAndEditModalFormRef.setFieldsValue({
        ...row,
        passwordType: 'custom'
      })
    }

    const AddAndEditModal = () => {
      return (
        <Form
          preserve={false}
          form={addAndEditModalFormRef}
          name='addAndEditModal'
          initialValues={{
            usertype: 8,
            passwordType: 'default'
          }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            style={{ paddingBottom: '10px' }}
            name='usertype'
            label='角色'
            rules={[{ required: true, message: '请选择角色' }]}
            help='指定角色权限'
          >
            <Select
              placeholder='请选择角色'
              options={[
                { value: 8, label: '管理员' },
                { value: 7, label: '审核管理员' },
                { value: 6, label: '客服管理' },
                { value: 5, label: '客服' }
              ]}
            />
          </Form.Item>

          <Form.Item
            style={{ paddingBottom: '10px' }}
            name='nickname'
            label='用户姓名'
            rules={[{ required: true, message: '请输入用户姓名' }]}
            help='最大长度64个字符，允许输入中文、英文字母、数字或特殊符号'
          >
            <Input placeholder='请输入用户姓名' allowClear />
          </Form.Item>

          <Form.Item
            style={{ paddingBottom: '10px' }}
            name='phone'
            label='手机号码'
            rules={[
              { required: true, message: '请输入手机号码' },
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' }
            ]}
            help='请输入11位手机号码'
          >
            <Input placeholder='请输入手机号码' allowClear />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: '10px' }}
            name='passwordType'
            label='初始密码'
            rules={[{ required: true, message: '请选择密码类型' }]}
          >
            <Radio.Group>
              <Radio value={'default'}>默认密码</Radio>
              <Radio value={'custom'}>自定义密码</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.passwordType !== curValues.passwordType}>
            {() => {
              let isDefault = addAndEditModalFormRef.getFieldValue('passwordType') === 'default'

              return (
                <Form.Item
                  label=' '
                  colon={false}
                  name='password'
                  rules={[
                    {
                      required: !isDefault,
                      message: '请输入密码'
                    },
                    {
                      min: 6,
                      message: '密码长度最少6位'
                    }
                  ]}
                  help='允许填写英文字母、数字或特殊符号，长度最少6位'
                  labelCol={{ span: 5 }}
                  required={!isDefault}
                >
                  <Input placeholder={isDefault ? '已启用默认密码' : '请输入密码'} allowClear disabled={isDefault} />
                </Form.Item>
              )
            }}
          </Form.Item>
        </Form>
      )
    }

    let typeObj = {
      add: {
        title: '新增管理员',
        getFn: params => CreateManageUser(params)
      },
      edit: {
        title: '编辑管理员',
        getFn: params => UpdateManageUser(params)
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
        params.password = encryptPassword(params.password)
        type === 'edit' && (params.userid = row.userid)

        await typeObj[type].getFn(params)
        tableRef.current.reload()
        message.success('操作成功')
      }
    })
  }

  const originColumns = [
    {
      title: 'ID',
      dataIndex: 'venusid',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '角色',
      width: 150,
      dataIndex: 'usertype',
      hideInSearch: true,
      align: 'center',
      valueEnum: {
        8: {
          text: '管理员',
          status: 'Processing'
        },
        7: {
          text: '审核管理员',
          status: 'Success'
        },
        6: {
          text: '客服管理',
          status: 'Warning'
        },
        5: {
          text: '客服',
          status: 'Default'
        }
      }
    },
    {
      title: '用户名称',
      dataIndex: 'nickname',
      width: 150,
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      width: 150,
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 150,
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'forbidden',
      width: 80,
      align: 'center',
      hideInSearch: true,
      render: (_, row) => {
        return (
          <Popconfirm
            key='status'
            title='确定更改状态吗？'
            onConfirm={() => handleChangeStatus(row)}
            okText='确认'
            cancelText='取消'
          >
            <Switch checkedChildren='开启' unCheckedChildren='关闭' checked={row.forbidden === 1} />
          </Popconfirm>
        )
      }
    },
    {
      title: '输入ID/名称/手机号',
      hideInTable: true,
      dataIndex: 'option'
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
          <Button type='primary' ghost onClick={() => handleAddAndEdit('edit', row)}>
            修改信息
          </Button>
        )
      }
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        const filters = {
          option: params.option
        }

        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          ...filters
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetManageList(param)
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
          新增管理员
        </Button>
      }
      scroll={{ x: 'max-content' }}
      rowKey='userid'
      columns={originColumns}
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
        span: 12
      }}
    />
  )
}
