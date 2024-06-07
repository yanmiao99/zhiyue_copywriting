/*
 * form.item 上传图片组件
 * 使用方式 :
 *  <FormUploadImg required name='test1' label='催收信息截图' echoPicture={legalPersonBackCardPic} />
 * */

import React, { useEffect, useState } from 'react'
import { Upload, Form, App } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'

/**
 * @name 绑定的名称
 * @label 显示的名称
 * @required 是否必填
 * @text 文本
 * @tooltip 提示语
 * */
const FormUpload = ({ name, label, required, text, tooltip, disabled, maxCount }) => {
  const normFile = e => {
    return e
  }

  return (
    <Form.Item
      name={name}
      label={label}
      getValueFromEvent={normFile}
      tooltip={tooltip}
      rules={[{ required, message: `请输入${label}` }]}
    >
      <UploadItem label={label} text={text} disabled={disabled} maxCount={maxCount} />
    </Form.Item>
  )
}
const UploadItem = ({ onChange, value, label, text, disabled, maxCount }) => {
  const { UPLOAD_URL } = useModel('Global')
  const { message, modal } = App.useApp()
  const [fileList, setFileList] = useState([])

  // 实现回显
  useEffect(() => {
    if (value) {
      setFileList([
        {
          value_attribute: value,
          url: value
        }
      ])
    }
  }, [value])

  // 上传图片前的校验
  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传png或jpeg格式的图片')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片不能超过2MB')
    }
    return isJpgOrPng && isLt2M
  }

  // 上传图片的回调
  const onUploadChange = e => {
    if (e.file.status === 'done') {
      if (e.fileList.length) {
        const list = e.fileList.filter(i => i.value_attribute || i.response?.data?.img_url)
        onChange(list[0] ? list[0].value_attribute || list[0].response.data.img_url : '')
        message.success('上传成功')
      } else {
        onChange('')
      }
    } else if (e.file.status === 'error') {
      message.error('上传失败')
    }
    setFileList(e.fileList)
  }

  // 预览图片
  const handlePreview = async file => {
    if (fileList.length) {
      let url = fileList[0].value_attribute || fileList[0].response?.data?.img_url
      modal.info({
        title: '图片预览',
        width: 500,
        maskClosable: true,
        icon: null,
        content: <img src={url} style={{ width: '100%', marginTop: '10px' }} alt='图片预览' />,
        okText: '关闭'
      })
    }
  }

  return (
    <Upload
      maxCount={maxCount || 1}
      action={UPLOAD_URL}
      accept='image/*'
      beforeUpload={beforeUpload}
      onChange={onUploadChange}
      onPreview={handlePreview}
      listType='picture-card'
      fileList={fileList}
      disabled={disabled}
    >
      {fileList.length === maxCount ? null : (
        <div style={{ padding: '0 10px' }}>
          <UploadOutlined />
          <div style={{ marginTop: 8 }}>{text || label}</div>
        </div>
      )}
    </Upload>
  )
}

export default FormUpload
