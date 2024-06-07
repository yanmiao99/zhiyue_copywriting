import styles from './index.less'
import { useEffect, useState } from 'react'
import { Empty, Tag } from 'antd'

const RechargeRecords = ({ data }) => {
  const [list, setList] = useState([]) //  列表数据
  const [total, setTotal] = useState(0) //  总数

  // 处理数据
  const formatData = () => {
    setTotal(data.balance)

    let typeObj = {
      recharge: '充值记录',
      refund: '退款记录',
      consume: '消费记录'
    }

    let paymentType = {
      alipay: {
        title: '支付宝支付',
        color: '#1E90FF'
      },
      wechat: {
        title: '微信支付',
        color: '#22C587'
      }
    }

    let res = []
    data.list.forEach(item => {
      res.push({
        currentbalance: item.currentbalance,
        orderId: item.orderid,
        time: item.occurtime,
        name: typeObj[item.optype],
        amount: item.optype === 'recharge' ? `+${item.amount}` : `-${item.amount}`,
        color: item.optype === 'recharge' ? '#22C587' : '#FF751A',
        paymentType: paymentType[item.paymenttype]?.title || '未知',
        paymentTypeColor: paymentType[item.paymenttype]?.color || '#FF751A'
      })
    })

    setList(res)
  }

  useEffect(() => {
    formatData()
  }, [data])

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper_total}>充值总额 : {total}</div>

      {list.length ? (
        list.map((item, index) => {
          return (
            <div className={styles.wrapper_item} key={index}>
              <div className={styles.wrapper_item_header}>
                <div>订单号 : {item.orderId}</div>
                <div>{item.time}</div>
              </div>

              <div className={styles.wrapper_item_top}>
                <div className={styles.wrapper_item_name}>{item.name}</div>
                <div className={styles.wrapper_item_number} style={{ color: item.color }}>
                  {item.amount}
                </div>
              </div>

              <div className={styles.wrapper_item_bottom}>
                <Tag color={item.paymentTypeColor}>{item.paymentType}</Tag>
                <div className={styles.current_balance}>当前余额: {item.currentbalance}</div>
              </div>
            </div>
          )
        })
      ) : (
        <Empty />
      )}
    </div>
  )
}

export default RechargeRecords
