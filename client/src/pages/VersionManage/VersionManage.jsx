import React, { useState, useRef, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { App, Button, Form, Input, Popconfirm, Space, Radio } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import FormUploadFile from '@/components/FormUploadFile'
import { InputNumber } from 'antd'

export default () => {
  const { GetOTAVersionList, UpsertOTAVersion } = useModel('VersionManage')
  const { message, modal } = App.useApp()
  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(1) //  当前页码
  const tableRef = useRef()

  const [addAndEditModalFormRef] = Form.useForm()

  // 添加/修改
  const handleAddAndEdit = async () => {
    const AddAndEditModal = () => {
      return (
        <Form
          preserve={false}
          form={addAndEditModalFormRef}
          name='addAndEditModal'
          initialValues={{
            platform: 'android'
          }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item name='appid' label='appid' rules={[{ required: true, message: '请输入appid' }]}>
            <Input placeholder='请输入appid' allowClear />
          </Form.Item>

          <Form.Item name='title' label='标题' rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder='请输入标题' allowClear />
          </Form.Item>

          <Form.Item name='name' label='名称' rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder='请输入名称' allowClear />
          </Form.Item>

          <Form.Item name='platform' label='平台' rules={[{ required: true, message: '请选择平台' }]}>
            <Radio.Group>
              <Radio value='android'>安卓</Radio>
              <Radio value='ios'>IOS</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name='version' label='版本' rules={[{ required: true, message: '请输入版本' }]}>
            <Input placeholder='请输入版本' allowClear />
          </Form.Item>

          <Form.Item name='versioncode' label='实际版本' rules={[{ required: true, message: '请输入实际版本' }]}>
            <InputNumber placeholder='请输入实际版本' style={{ width: '100%' }} />
          </Form.Item>

          <FormUploadFile required name='otapath' label='安装包' />

          <Form.Item name='desc' label='描述' rules={[{ required: true, message: '请输入描述' }]}>
            <Input.TextArea placeholder='请输入描述' allowClear />
          </Form.Item>
        </Form>
      )
    }

    modal.confirm({
      title: '发布新版本',
      width: 600,
      icon: null,
      content: <AddAndEditModal />,
      onOk: async () => {
        await addAndEditModalFormRef.validateFields()
        let params = addAndEditModalFormRef.getFieldsValue()
        await UpsertOTAVersion(params)
        tableRef.current.reload()
        message.success('操作成功')
      }
    })
  }

  const originColumns = [
    {
      title: 'appid',
      dataIndex: 'appid',
      width: 100,
      align: 'center'
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 100,
      align: 'center'
    },
    {
      title: '平台',
      dataIndex: 'platform',
      width: 100,
      align: 'center',
      hideInSearch: true,
      valueEnum: {
        android: {
          text: '安卓',
          status: 'Success'
        },
        ios: {
          text: 'IOS',
          status: 'Warning'
        }
      }
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '实际版本',
      dataIndex: 'versioncode',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '描述',
      dataIndex: 'desc',
      width: 100,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      width: 150,
      align: 'center',
      valueType: 'dateTime',
      hideInSearch: true
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          title: params.title,
          appid: params.appid
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetOTAVersionList(param)
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
          onClick={() => handleAddAndEdit()}
          key={Math.random().toString()}
          type='primary'
        >
          发布新版本
        </Button>
      }
      scroll={{ x: 'max-content' }}
      rowKey='id'
      columns={originColumns}
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
        span: 8
      }}
    />
  )
}
