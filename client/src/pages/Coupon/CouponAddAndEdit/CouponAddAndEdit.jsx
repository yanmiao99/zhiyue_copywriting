import { useModel, useLocation } from '@umijs/max'
import { useEffect, useState, useRef } from 'react'
import BackPage from '@/components/BackPage'
import FormUploadImg from '@/components/FormUploadImg'
import { App, Button, Form, Input, DatePicker, Space, Checkbox, InputNumber, Radio } from 'antd'
import dayjs from 'dayjs'

const { TextArea } = Input
const { RangePicker } = DatePicker

const typeMap = {
  add: {
    title: '新增优惠券',
    footer: '发布'
  },
  edit: {
    title: '编辑优惠券',
    footer: '保存修改'
  }
}

const CouponAddAndEdit = () => {
  const { AddAndEditCoupon } = useModel('Coupon')
  const backPageRef = useRef()

  const location = useLocation()
  const [currentType, setCurrentType] = useState('add') // 当前类型
  const [currentRow, setCurrentRow] = useState({}) // 当前行数据

  const { message } = App.useApp()

  const [addAndEditFormRef] = Form.useForm()

  useEffect(() => {
    if (location.state?.type) setCurrentType(location.state?.type)
    if (location.state?.activityid && location.state?.type === 'edit') {
      let row = JSON.parse(location.state?.currentRow)
      setCurrentRow(row)

      addAndEditFormRef.setFieldsValue({
        ...row,
        time: [dayjs(row.effectivetime), dayjs(row.expirestime)],
        countType: row.claimlimt === 0 ? 'default' : 'custom',
        imageType: row.couponimage ? 'custom' : 'default'
      })
    }
  }, [])

  // 提交表单
  const handleSubmitForm = async () => {
    await addAndEditFormRef.validateFields()
    let values = addAndEditFormRef.getFieldsValue()
    const rangeTimeValue = values['time']
    let params = {
      ...values,
      effectivetime: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
      expirestime: rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
      claimlimt: values['claimlimt'] || 0,
      couponimage: values['couponimage'] || '',
      status: 1

      //"activityid":"", //新增时为空;编辑时不为空
      //"name":"aaaa", //名称
      //"effectivetime":"2006-01-02 15:04:05",//生效时间
      //"expirestime":"2006-01-02 15:04:05",//过期时间
      //"discount":40, //优惠金额
      //"claimlimt": 0, //限制领取次数，为0则不限制
      //"distribroles":[], //发放人员类型 1：学生  2：老师  5：客服
      //"couponimage":"", //优惠券图片  选默认图片时填空
      //"instruction":"", //使用介绍
      //"unsubset":1, //取消订阅配置 1：退款时失效  2：立即启用
      //"status": 1 //新增时默认为1;修改时按原值填写
      //"createtime":"" //编辑时带原值  新增时不需要带
    }

    if (currentType === 'edit') {
      params.activityid = currentRow.activityid
      params.status = currentRow.status
      params.createtime = currentRow.createtime
    }
    delete params.time
    await AddAndEditCoupon(params)

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
          {typeMap[currentType] && typeMap[currentType].footer}
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
            countType: 'default',
            imageType: 'default',
            unsubset: [1, 2]
          }}
        >
          <Form.Item
            name='name'
            label='优惠券名称: '
            wrapperCol={{ span: 8 }}
            rules={[{ required: true, message: '请输入优惠券名称' }]}
          >
            <Input placeholder='请输入优惠券名称' allowClear />
          </Form.Item>
          <Form.Item
            name='time'
            label='优惠券有效期: '
            wrapperCol={{ span: 8 }}
            rules={[{ required: true, message: '请选择优惠券有效期' }]}
          >
            <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name='discount'
            label='优惠金额: '
            rules={[{ required: true, message: '请输入优惠金额' }]}
            wrapperCol={{ span: 8 }}
          >
            <InputNumber placeholder='请输入优惠金额' addonAfter='元' />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: '10px' }}
            name='countType'
            label='领取次数限制'
            rules={[{ required: true, message: '领取次数限制' }]}
          >
            <Radio.Group>
              <Radio value={'default'}>不限制</Radio>
              <Radio value={'custom'}>每人活动期间最多领取</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: '-10px' }}
            wrapperCol={{ span: 24 }}
            shouldUpdate={(prevValues, curValues) => prevValues.countType !== curValues.countType}
          >
            {() => {
              let isDefault = addAndEditFormRef.getFieldValue('countType') === 'default'

              return (
                <>
                  {isDefault ? null : (
                    <Form.Item
                      label='领取次数'
                      name='claimlimt'
                      rules={[{ required: !isDefault, message: '请输入次数' }]}
                      labelCol={{ span: 3 }}
                      required={!isDefault}
                    >
                      <InputNumber
                        placeholder={isDefault ? '不限制次数' : '请输入每人活动期间最多领取'}
                        disabled={isDefault}
                        addonAfter='次'
                      />
                    </Form.Item>
                  )}
                </>
              )
            }}
          </Form.Item>

          <Form.Item name='distribroles' label='派发人群: ' rules={[{ required: true, message: '请选择派发人群' }]}>
            <Checkbox.Group>
              <Checkbox value={1}>学生</Checkbox>
              <Checkbox value={2}>老师</Checkbox>
              <Checkbox value={5}>客服</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name='imageType' label='优惠券图片' rules={[{ required: true, message: '请选择优惠券图片类型' }]}>
            <Radio.Group>
              <Radio value={'default'}>默认图片</Radio>
              <Radio value={'custom'}>自定义图片</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: '-10px' }}
            wrapperCol={{ span: 24 }}
            shouldUpdate={(prevValues, curValues) => prevValues.imageType !== curValues.imageType}
          >
            {() => {
              let isDefault = addAndEditFormRef.getFieldValue('imageType') === 'default'
              return (
                <>
                  {isDefault ? null : (
                    <FormUploadImg labelCol={{ span: 3 }} required={!isDefault} name='couponimage' label='封面图片' />
                  )}
                </>
              )
            }}
          </Form.Item>

          <Form.Item
            name='instruction'
            label='使用须知: '
            rules={[{ required: true, message: '请输入使用须知' }]}
            wrapperCol={{ span: 8 }}
          >
            <TextArea rows={4} placeholder='请输入使用须知' allowClear />
          </Form.Item>

          <Form.Item name='unsubset' label='退订设置: '>
            <Checkbox.Group>
              <Checkbox value={1}>退款时失效</Checkbox>
              <Checkbox value={2}>立即启用</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default CouponAddAndEdit
