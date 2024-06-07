import React, { useEffect, useState } from 'react'
import { Upload, Form, App, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useModel } from '@umijs/max'
import { getAccessToken, getUserInfo } from '../../utils/utils'

const FormUploadFile = props => {
  let { label, required, text } = props
  const normFile = e => {
    return e
  }

  return (
    <Form.Item getValueFromEvent={normFile} rules={[{ required, message: `请上传${label}` }]} {...props}>
      <UploadItem label={label} text={text} />
    </Form.Item>
  )
}
const UploadItem = props => {
  const { onChange, value, label, text } = props

  const { UPLOAD_URL_FILE } = useModel('Global')
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

  // 上传图片前的校验
  const beforeUpload = file => {
    // 判断 file.name 的后缀是否为 .apk .ipa .wgt
    const isApkOrIpaOrWgt = file.name.endsWith('.apk') || file.name.endsWith('.ipa') || file.name.endsWith('.wgt')
    if (!isApkOrIpaOrWgt) {
      message.error('只能上传.apk .ipa .wgt格式的文件')
    }
    return isApkOrIpaOrWgt || Upload.LIST_IGNORE
  }

  // 上传图片的回调
  const onUploadChange = e => {
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

  return (
    <Upload
      {...props}
      maxCount={1}
      action={UPLOAD_URL_FILE}
      accept='.apk, .ipa, .wgt'
      beforeUpload={beforeUpload}
      onChange={onUploadChange}
      fileList={fileList}
      progress={{
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068'
        },
        strokeWidth: 3,
        format: percent => percent && `${parseFloat(percent.toFixed(2))}%`
      }}
      headers={{
        token: getAccessToken(),
        userid: getUserInfo()?.userid || null
      }}
    >
      <Button icon={<UploadOutlined />}>{text || label}</Button>
    </Upload>
  )
}

export default FormUploadFile
