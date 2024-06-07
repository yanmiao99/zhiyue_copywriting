import styles from './index.less'
import { useEffect, useState } from 'react'
import { Empty } from 'antd'

const RechargeRecords = ({ data }) => {
  console.log('data========', data)
  const [list, setList] = useState([]) //  列表数据

  const [total, setTotal] = useState(0) //  总收益
  const [totalWithdraw, setTotalWithdraw] = useState(0) //  累计提现

  // 处理数据
  const formatData = () => {
    let res = []
    data.list.forEach(item => {
      res.push({
        orderId: item.orderid,
        time: item.ordertime,
        name: item.nickname,
        amount: item.payamount >= 0 ? `+${item.payamount}` : `-${item.payamount}`,
        color: item.payamount >= 0 ? '#22C587' : '#FF751A',
        shopName: item.title
      })
    })

    setTotal(data.incomeall)
    setTotalWithdraw(data.withdraw)

    setList(res)
  }

  useEffect(() => {
    formatData()
  }, [data])

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper_total}>
        <span>总收益 : {total ? total : 0}</span>
        <span>累计提现 : {totalWithdraw ? totalWithdraw : 0}</span>
      </div>
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
              <div className={styles.wrapper_item_bottom}>{item.shopName}</div>
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
