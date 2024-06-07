import { useModel, useLocation } from '@umijs/max'
import { useEffect, useState, useRef } from 'react'
import BackPage from '@/components/BackPage'
import FormUploadImg from '@/components/FormUploadImg'
import { App, Button, Form, Input, DatePicker, Space, Radio, Select, InputNumber, Checkbox } from 'antd'
import PromotionCustomTable from '../PromotionCustomTable/PromotionCustomTable'
import dayjs from 'dayjs'

const { TextArea } = Input
const { RangePicker } = DatePicker

const typeMap = {
  add: {
    title: '新建推广任务'
  },
  edit: {
    title: '编辑推广任务'
  }
}

const PromotionAddAndEdit = () => {
  const location = useLocation()
  const [currentType, setCurrentType] = useState('add') // 当前类型

  const { CheckPromotionDetails, AddAndEditPromotion } = useModel('PromotionManage')

  const { defaultName } = useModel('Global')

  const [addAndEditFormRef] = Form.useForm()
  const backPageRef = useRef()
  const { message } = App.useApp()

  useEffect(() => {
    if (location.state?.type) setCurrentType(location.state?.type)
    if (location.state?.id && location.state?.type === 'edit') {
      handleCheckDetails(location.state?.id)
    }
  }, [])

  // 查看详情
  const handleCheckDetails = async id => {
    const res = await CheckPromotionDetails(id)
    // 设置表单值
    addAndEditFormRef.setFieldsValue({
      ...res,
      time: [dayjs(res?.begintime), dayjs(res?.endtime)],
      uploadCover: res?.imagelist[0],
      uploadContent: res?.imagelist[1],
      unsubset: res?.unsubset === 1 ? [1] : []
    })
  }

  // 提交表单
  const handleSubmitForm = async () => {
    await addAndEditFormRef.validateFields()
    let values = addAndEditFormRef.getFieldsValue()

    let params = {
      ...values,
      begintime: values['time'][0].format('YYYY-MM-DD HH:mm:ss'),
      endtime: values['time'][1].format('YYYY-MM-DD HH:mm:ss'),
      imagelist: [values['uploadCover'], values['uploadContent']],
      unsubset: values['unsubset']?.includes(1) ? 1 : 2
    }

    delete params['time']
    delete params['uploadCover']
    delete params['uploadContent']

    if (currentType === 'edit') {
      params.id = location.state?.id
    }

    await AddAndEditPromotion(params)
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
        <Button type='primary' onClick={handleSubmitForm}>
          提交
        </Button>
      </div>

      <div className='add_and_edit_wrapper'>
        <Form
          preserve={false}
          form={addAndEditFormRef}
          name='addAndEdit'
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          initialValues={{
            rewardrules: {
              targettype: 1,
              rewardtype: 1
            },
            tousertype: 1,
            promotetype: 'qrcode',
            touserlist: []
          }}
        >
          <Form.Item
            name='title'
            label='推广任务名称: '
            wrapperCol={{ span: 8 }}
            rules={[{ required: true, message: '请输入推广任务名称' }]}
          >
            <Input placeholder='请输入推广任务名称' allowClear />
          </Form.Item>

          <Form.Item
            name='time'
            label='推广有效期: '
            wrapperCol={{ span: 8 }}
            rules={[{ required: true, message: '请选择推广有效期' }]}
          >
            <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label='推广返利: ' required>
            <Space wrap>
              当推广
              <Form.Item
                name={['rewardrules', 'targettype']}
                rules={[{ required: true, message: '请选择推广任务' }]}
                noStyle
              >
                <Select
                  style={{ width: 150 }}
                  placeholder='请选择推广任务'
                  options={[
                    { value: 1, label: `${defaultName}软件` },
                    { value: 2, label: '其他' }
                  ]}
                />
              </Form.Item>
              达到
              <Form.Item
                name={['rewardrules', 'targetval']}
                rules={[{ required: true, message: '请输入人数' }]}
                noStyle
              >
                <InputNumber min={1} placeholder='请输入人数' style={{ width: 100 }} />
              </Form.Item>
              人时，奖励
              <Form.Item
                name={['rewardrules', 'rewardtype']}
                rules={[{ required: true, message: '请选择返利类型' }]}
                noStyle
              >
                <Select
                  style={{ width: 150 }}
                  placeholder='请选择返利类型'
                  options={[
                    { value: 1, label: '现金' },
                    { value: 2, label: '金币' }
                  ]}
                />
              </Form.Item>
              <Form.Item
                name={['rewardrules', 'rewardval']}
                rules={[{ required: true, message: '请输入返利数额' }]}
                noStyle
              >
                <InputNumber min={1} placeholder='请输入返利数额' style={{ width: 150 }} />
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item
            name='planval'
            label='计划推广人数: '
            rules={[{ required: true, message: '请输入计划推广人数' }]}
            wrapperCol={{ span: 8 }}
          >
            <InputNumber style={{ width: 150 }} placeholder='请输入计划推广人数' min={1} />
          </Form.Item>

          <Form.Item name='tousertype' label='派发人群: ' rules={[{ required: true, message: '请选择派发人群' }]}>
            <Radio.Group>
              <Radio value={1}>学生</Radio>
              <Radio value={2}>老师</Radio>
              <Radio value={5}>客服</Radio>
              <Radio value={3}>自定义人群</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            style={{
              marginBottom: '-30px'
            }}
            shouldUpdate={(prevValues, curValues) => prevValues.tousertype !== curValues.tousertype}
          >
            {() => {
              let showTable = addAndEditFormRef.getFieldValue('tousertype') === 3
              return (
                <>
                  {showTable ? (
                    <Form.Item
                      name='touserlist'
                      label='自定义账号: '
                      rules={[{ required: true, message: '请选择自定义账号' }]}
                      wrapperCol={{ span: 16 }}
                      labelCol={{ span: 4 }}
                    >
                      <PromotionCustomTable />
                    </Form.Item>
                  ) : null}
                </>
              )
            }}
          </Form.Item>

          <Form.Item name='promotetype' label='推广类型: ' rules={[{ required: true, message: '请选择推广类型' }]}>
            <Radio.Group>
              <Radio value='qrcode'>二维码</Radio>
              <Radio value='promotecode'>推广码</Radio>
            </Radio.Group>
          </Form.Item>

          <FormUploadImg required name='uploadCover' label='封面图片' />

          <FormUploadImg required name='uploadContent' label='内容页' />

          <Form.Item
            name='promoteremark'
            label='推广须知: '
            rules={[{ required: true, message: '请输入推广须知' }]}
            wrapperCol={{ span: 8 }}
          >
            <TextArea rows={4} placeholder='请输入推广须知' allowClear />
          </Form.Item>

          <Form.Item name='unsubset' label='退订设置: '>
            <Checkbox.Group>
              <Checkbox value={1}>立即启用</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default PromotionAddAndEdit
