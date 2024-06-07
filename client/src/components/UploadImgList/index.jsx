import { Upload, App } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useModel } from '@umijs/max'
import { getAccessToken, getUserInfo } from '../../utils/utils'

const UploadImgList = props => {
  const { onChange, value, maxCount } = props
  const { modal } = App.useApp()

  const [fileList, setFileList] = useState([])
  const { UPLOAD_URL } = useModel('Global')

  useEffect(() => {
    if (value && value.length) {
      let arr = value.map(item => {
        return {
          name: 'image.png',
          status: 'done',
          url: item
        }
      })
      setFileList(arr)
    }
  }, [])

  const handleChange = e => {
    if (e.fileList.length) {
      onChange(
        e.fileList
          .filter(i => i.url || i.response?.data?.filepath)
          .map(i => ({
            value: i.url || i.response.data.filepath
          }))
      )
    } else {
      onChange([])
    }
    setFileList(e.fileList)
  }

  // 预览图片
  const handlePreview = async file => {
    let url = file?.url || file.response?.data?.filepath
    modal.info({
      title: '图片预览',
      width: 500,
      maskClosable: true,
      icon: null,
      content: <img src={url} style={{ width: '100%', marginTop: '10px' }} alt='图片预览' />,
      okText: '关闭'
    })
  }

  return (
    <Upload
      action={UPLOAD_URL}
      listType='picture-card'
      accept='image/*'
      maxCount={maxCount || 1}
      multiple={true}
      fileList={fileList}
      onChange={handleChange}
      onPreview={handlePreview}
      headers={{
        token: getAccessToken(),
        userid: getUserInfo()?.userid || null
      }}
    >
      <div>
        <PlusOutlined />
        <div
          style={{
            marginTop: 8
          }}
        >
          上传图片
        </div>
      </div>
    </Upload>
  )
}

export default UploadImgList
