import weixin from '@/assets/common/weixin.png'
import zhifubao from '@/assets/common/zhifubao.png'
import successIcon from '@/assets/common/success.png'
import errorIcon from '@/assets/common/error.png'
import QRCode from 'qrcode.react'
import { useEffect, useState } from 'react'
import { useModel } from '@umijs/max'
import './QrcodeBox.less'

const QrcodeBox = ({ res, paymenttype }) => {
  const { QueryOrderPayStatus } = useModel('Pay')
  const [payStatus, setPayStatus] = useState(1)
  const [payText, setPayText] = useState('')
  let timer = null

  useEffect(() => {
    getOrderStatus(res.orderid)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  // 获取订单状态
  const getOrderStatus = async orderid => {
    const orderRes = await QueryOrderPayStatus({ orderid })
    if (orderRes.orderstatus === 1) {
      timer = setTimeout(() => {
        getOrderStatus(orderid)
      }, 1000)
    } else {
      if (orderRes.orderstatus === 2) {
        setPayText('支付成功')
      } else {
        setPayText('支付失败')
      }
      setPayStatus(orderRes.orderstatus)
    }

    // 一分钟后没有支付成功的操作
    setTimeout(() => {
      setPayStatus(3)
      setPayText('支付超时,请重新进行支付')
      clearTimeout(timer)
    }, 60000)
  }

  return (
    <div className='qrcode_box'>
      {payStatus === 1 ? (
        <div className='pay_qucode'>
          <QRCode value={res.qrcodeurl} size={256} fgColor='#000000' />
          <div className='qrcode_box_img'>
            {paymenttype === 'wechat' ? <img src={weixin} alt='weixin' /> : <img src={zhifubao} alt='zhifubao' />}
          </div>
        </div>
      ) : (
        <div className='pay_status_info'>
          {payStatus === 2 ? <img src={successIcon} alt='success' /> : <img src={errorIcon} alt='error' />}
          <p>{payText}</p>
        </div>
      )}
    </div>
  )
}
export default QrcodeBox
