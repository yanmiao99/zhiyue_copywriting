import styles from './index.less'
import { useEffect, useState } from 'react'
import { Empty } from 'antd'

const GoldRecords = ({ data }) => {
  const [list, setList] = useState([]) //  列表数据
  // 处理数据
  const formatData = () => {
    //let tempData = data
    //delete tempData?.code
    //
    //let tempArr = []
    //for (let key in tempData) {
    //  tempArr.push(tempData[key])
    //}
    let res = []
    data.list.forEach(item => {
      res.push({
        name: item.opetype === 1 ? '签到奖励' : '兑换优惠券',
        amount: item.amount >= 0 ? `+${item.amount}` : `-${item.amount}`,
        time: item.createtime,
        color: item.opetype === 1 ? '#22C587' : '#FF751A',
        currentamount: item.currentamount
      })
    })

    setList(res)
  }

  useEffect(() => {
    formatData()
  }, [data])

  return (
    <div className={styles.wrapper}>
      {list.length ? (
        list.map((item, index) => {
          return (
            <div className={styles.wrapper_item} key={index}>
              <div className={styles.wrapper_item_top}>
                <div className={styles.wrapper_item_name}>{item.name}</div>
                <div className={styles.wrapper_item_number} style={{ color: item.color }}>
                  {item.amount}
                </div>
              </div>
              <div className={styles.wrapper_item_bottom}>
                <div>{item.time}</div>
                <div className={styles.current_amount}>当前余额: {item.currentamount}</div>
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

export default GoldRecords
