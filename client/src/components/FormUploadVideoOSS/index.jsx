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
import TcVod from 'vod-js-sdk-v6'

const FormUploadVideo = ({ videoSignType, ...props }) => {
  let { label, required } = props

  const normFile = e => {
    return e
  }

  return (
    <Form.Item getValueFromEvent={normFile} rules={[{ required, message: `请上传${label}` }]} {...props}>
      <UploadItem videoSignType={videoSignType} />
    </Form.Item>
  )
}

const UploadItem = ({ videoSignType, ...props }) => {
  const { onChange, value } = props
  const { GetSign } = useModel('Global')
  const { message, modal } = App.useApp()
  const [fileList, setFileList] = useState([])

  // 实现回显
  useEffect(() => {
    if (value) {
      setFileList([
        {
          fileId: value.fileId,
          url: value.url,
          name: value.name ? value.name : Math.random().toString(36).slice(-8)
        }
      ])
    }
  }, [value])

  const propsVideo = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: 'video/*',
    fileList,
    listType: 'picture',
    headers: {
      token: getAccessToken(),
      userid: getUserInfo()?.userid || null
    },
    onPreview: () => {
      if (fileList.length) {
        let url = fileList[0].url
        modal.info({
          title: '视频预览',
          width: 800,
          height: 600,
          maskClosable: true,
          icon: null,
          content: (
            <video src={url} controls style={{ width: '100%', marginTop: '10px' }} alt='视频预览'>
              您的浏览器不支持 video 标签。
            </video>
          ),
          okText: '关闭'
        })
      }
    },

    progress: {
      strokeColor: {
        from: '#6C63FF',
        to: '#6C63FF'
      },
      strokeWidth: 10
    },

    onRemove: () => {
      setFileList([])
      onChange(null)
    },

    onChange: e => {
      setFileList(e.fileList)
    },

    beforeUpload: file => {
      const isLt1024M = file.size / 1024 / 1024 < 1024
      if (!isLt1024M) {
        message.error('视频大小不能超过 1024MB (1GB)!')
      }
      return isLt1024M || Upload.LIST_IGNORE
    },

    customRequest: option => {
      const tcVod = new TcVod({
        getSignature: async () => {
          const res = await GetSign({ uploadtype: videoSignType })
          return res.sign
        }
      })

      const uploader = tcVod.upload({
        mediaFile: option.file // 媒体文件（视频或音频或图片），类型为 File
      })

      uploader
        .on('media_progress', ({ percent }) => {
          option.onProgress({ percent: parseFloat(percent * 100).toFixed(2) }, option.file)
        })
        .done()
        .then(res => {
          option.onSuccess()
          onChange({
            fileId: res.fileId,
            url: res.video.url,
            name: option.file.name
          })
          message.success('上传成功')
        })
        .catch(err => {
          console.log(err)
          option.onError()
          message.error('上传失败')
        })
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

export default FormUploadVideo
