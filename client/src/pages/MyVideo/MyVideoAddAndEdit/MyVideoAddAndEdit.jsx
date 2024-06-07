import { useModel, useLocation } from '@umijs/max'
import { useEffect, useState, useRef } from 'react'
import './MyVideoAddAndEdit.less'
import BackPage from '@/components/BackPage'
import FormUploadVideoOSS from '@/components/FormUploadVideoOSS'
import FormUploadImg from '@/components/FormUploadImg'
import { App, Button, Form, Input, Select, Space } from 'antd'
import { getUserInfo } from '@/utils/utils'

const { TextArea } = Input

const typeMap = {
  add: {
    title: '新建视频'
  },
  edit: {
    title: '编辑视频'
  }
}

const tags = [
  '产品经理',
  '产品',
  '框架',
  '系统',
  '制作',
  '案例',
  '电商',
  '利用',
  '后台',
  '学习',
  '产品设计',
  '视频教程'
]

const MyVideoAddAndEdit = () => {
  const { SubmitVideoAudit, StagingVideoDraft } = useModel('MyVideo')

  const location = useLocation()
  const [currentType, setCurrentType] = useState('add') // 当前类型
  const [currentRow, setCurrentRow] = useState({}) // 当前行数据

  const { message } = App.useApp()
  const [addAndEditFormRef] = Form.useForm()
  const backPageRef = useRef()

  useEffect(() => {
    if (location.state?.type) setCurrentType(location.state?.type)
    if (location.state?.id && location.state?.type === 'edit') {
      let row = JSON.parse(location.state?.currentRow)
      setCurrentRow(row)

      addAndEditFormRef.setFieldsValue({
        ...row,
        videoFile: {
          url: row.videourl,
          fileId: row.fileid,
          name: row.videoName ? row.videoName : row.title
        }
      })
    }
  }, [])

  const handleSelectTag = item => {
    let list = addAndEditFormRef.getFieldValue('tags') || []
    if (list.includes(item)) {
      list = list.filter(i => i !== item)
    } else {
      list.push(item)
    }
    addAndEditFormRef.setFieldValue('tags', [...list])
  }

  // 提交表单
  const handleSubmitForm = async type => {
    let typeObj = {
      draft: StagingVideoDraft,
      submit: SubmitVideoAudit
    }

    await addAndEditFormRef.validateFields()
    const values = await addAndEditFormRef.getFieldValue()
    let params = {
      userid: getUserInfo()?.userid || null,
      ...values,
      videourl: values.videoFile.url,
      fileid: values.videoFile.fileId,
      videoName: values.videoFile.name
    }

    if (currentType === 'edit') {
      params.id = currentRow.id
    }

    delete params.videoFile
    await typeObj[type](params)
    message.success('提交成功, 2秒后返回列表页')
    setTimeout(() => {
      backPageRef.current.handleBackGo()
    }, 2000)
  }

  return (
    <>
      <div className='add_and_edit_header'>
        <BackPage ref={backPageRef} />
        <h2>{typeMap[currentType] && typeMap[currentType].title}</h2>
        <Space>
          <Button style={{ background: '#FF751A' }} type='primary' onClick={() => handleSubmitForm('draft')}>
            暂存草稿
          </Button>
          <Button type='primary' onClick={() => handleSubmitForm('submit')}>
            提交审核
          </Button>
        </Space>
      </div>
      <div className='add_and_edit_wrapper'>
        <Form
          preserve={false}
          form={addAndEditFormRef}
          name='addAndEdit'
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          initialValues={{}}
        >
          <Form.Item name='title' label='视频标题: ' rules={[{ required: true, message: '请输入视频标题' }]}>
            <Input placeholder='请输入视频标题' allowClear />
          </Form.Item>

          <FormUploadImg required name='logourl' label='视频封面' />

          <FormUploadVideoOSS required name='videoFile' label='课程视频' videoSignType='frontvideo' />

          <Form.Item label='标签: ' name='tags' rules={[{ required: true, message: '请选择最少一个标签' }]}>
            <Select
              tokenSeparators={[',']}
              mode='tags'
              maxTagCount={10}
              style={{ width: '100%' }}
              placeholder='按回车键Enter创建标签'
              open={false}
            />
          </Form.Item>

          <Form.Item name='tagsList' label='推荐: '>
            <Space wrap>
              {tags.map(item => {
                return (
                  <div className='tags_item' onClick={() => handleSelectTag(item)} key={item}>
                    {item}
                  </div>
                )
              })}
            </Space>
          </Form.Item>

          <Form.Item name='introduce' label='简介: ' rules={[{ required: true, message: '请输入视频简介' }]}>
            <TextArea rows={10} placeholder='请输入视频简介' showCount allowClear />
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default MyVideoAddAndEdit
