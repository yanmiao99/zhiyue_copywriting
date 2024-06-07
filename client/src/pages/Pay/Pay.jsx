import './Pay.less'
import { App, Form, InputNumber, Button } from 'antd'
import { useState } from 'react'
import weixin from '@/assets/common/weixin.png'
import zhifubao from '@/assets/common/zhifubao.png'
import xingbi from '@/assets/common/xingbi.png'
import { useModel } from '@umijs/max'
import QrcodeBox from '@/pages/Pay/QrcodeBox/QrcodeBox'
import { useEffect, useRef } from 'react'
import { getUserInfo } from '@/utils/utils'
import { useCountUp } from 'react-countup'

const Pay = () => {
  let amountType = [50, 100, 200, 500, 'custom']
  const [amountFormRef] = Form.useForm()
  const { modal } = App.useApp()
  const [tabActive, setTabActive] = useState(0)

  const { CreateOrder, CheckUserBalance } = useModel('Pay')
  const { setIsLoading } = useModel('Global')

  // 余额动画
  const balanceRef = useRef(null)
  const balanceAnimation = useCountUp({
    ref: balanceRef,
    start: 0,
    end: 0,
    duration: 1.5,
    decimals: 2
  })

  useEffect(() => {
    checkUserBalance()
  }, [])

  const checkUserBalance = async () => {
    const res = await CheckUserBalance({
      userid: getUserInfo()?.userid
    })
    balanceAnimation.update(res.balance.toFixed(2))
  }

  const handleChangeActive = (item, index) => {
    setTabActive(index)
    if (item !== 'custom') {
      amountFormRef.setFieldsValue({ payamount: undefined })
    }
  }

  const handleSubmit = async paymenttype => {
    setIsLoading(true)
    let params = {
      payamount: 0, //充值金额 浮点数
      innerordertype: 'starCurrency', //固定
      paymenttype, //支付方式 alipay,wechat
      qrcodewidth: '256' //生成的二维码宽度 默认128
    }

    if (amountType[tabActive] === 'custom') {
      await amountFormRef.validateFields()
      const values = amountFormRef.getFieldsValue()
      params.payamount = values.payamount
    } else {
      params.payamount = amountType[tabActive]
    }

    params.payamount = parseFloat(params.payamount)

    const res = await CreateOrder(params)

    let typeTile = {
      wechat: '微信',
      alipay: '支付宝'
    }

    modal.info({
      icon: null,
      title: `请使用${typeTile[paymenttype]}扫码支付`,
      content: <QrcodeBox res={res} paymenttype={paymenttype} />,
      okText: '关闭',
      onOk: () => {
        checkUserBalance()
      }
    })
    setIsLoading(false)
  }

  return (
    <div className='pay_wrapper'>
      <div className='pay_header'>
        <img src={xingbi} alt='星币' />
        <div className='pay_header_title'>星币余额:</div>
        <div className='pay_header_balance' ref={balanceRef}></div>
      </div>

      <div className='pay_content'>
        {amountType.map((item, index) => {
          return (
            <div
              className={'pay_item ' + (tabActive === index ? 'active' : '')}
              key={item}
              onClick={() => handleChangeActive(item, index)}
            >
              {item === 'custom' ? (
                <>
                  <div className='pay_title'>自定义金额</div>
                  <Form
                    style={{ width: '100%', marginTop: '20px' }}
                    preserve={false}
                    form={amountFormRef}
                    name='amountForm'
                  >
                    <Form.Item
                      name='payamount'
                      label=' '
                      colon={false}
                      rules={[{ required: true, message: '请输入充值金额' }]}
                    >
                      <InputNumber style={{ width: '100%' }} placeholder='请输入充值金额' />
                    </Form.Item>
                  </Form>
                </>
              ) : (
                <>
                  <div className='pay_title'>充值金额</div>
                  <div className='pay_amount'>
                    <span className='pay_amount_unit'>¥</span>
                    <span className='pay_amount_num'>{item}</span>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      <div className='pay_footer'>
        <div className='pay_footer_text'>
          <img src={weixin} alt='weixin' />
          <img src={zhifubao} alt='zhifubao' />
          <span>使用微信/支付宝扫码支付</span>
        </div>
        <Button type='primary' onClick={() => handleSubmit('wechat')}>
          微信支付
        </Button>

        <Button type='primary' style={{ background: '#65B2FB' }} onClick={() => handleSubmit('alipay')}>
          支付宝支付
        </Button>
      </div>
    </div>
  )
}
export default Pay
