/*
 * form.item 上传视频组件
 * 使用方式 :
 *  <FormUploadVideo required name='test1' label='催收信息截图' />
 * */

import React, { useEffect, useState } from 'react'
import { Upload, Form, App } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'
import { getAccessToken, getUserInfo } from '@/utils/utils'
const { Dragger } = Upload

const FormUpload = props => {
  let { label, required } = props
  const normFile = e => {
    return e
  }

  return (
    <Form.Item getValueFromEvent={normFile} rules={[{ required, message: `请上传${label}` }]} {...props}>
      <UploadItem />
    </Form.Item>
  )
}
const UploadItem = props => {
  const { onChange, value } = props
  const { UPLOAD_URL } = useModel('Global')
  const { message } = App.useApp()
  const [fileList, setFileList] = useState([])

  // 实现回显
  useEffect(() => {
    if (value) {
      setFileList([
        {
          value_attribute: value,
          url: value,
          name: Math.random().toString(36).slice(-8)
        }
      ])
    }
  }, [value])

  const propsVideo = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    action: UPLOAD_URL,
    accept: 'video/*',
    fileList,
    listType: 'picture-card',
    headers: {
      token: getAccessToken(),
      userid: getUserInfo()?.userid || null
    },
    onPreview() {
      message.warning('暂不支持预览视频')
    },
    onChange(e) {
      if (e.file.status === 'done') {
        if (e.fileList.length) {
          const list = e.fileList.filter(i => i.value_attribute || i.response?.data?.filepath)
          onChange(list[0] ? list[0].value_attribute || list[0].response.data.filepath : '')
          message.success('上传成功')
        } else {
          onChange('')
        }
      } else if (e.file.status === 'error') {
        message.error('上传失败')
      }
      setFileList(e.fileList)
    }
  }

  return (
    <Dragger {...propsVideo}>
      <div style={{ padding: '0 10px' }}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>上传视频</p>
        <p className='ant-upload-hint'>（点击上传/拖拽到此处上传）</p>
      </div>
    </Dragger>
  )
}

export default FormUpload
