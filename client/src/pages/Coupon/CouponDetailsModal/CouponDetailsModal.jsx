import React, { useEffect, useState } from 'react'
import { useModel } from '@umijs/max'
import { Empty, Image, Tag, Space } from 'antd'
import DetailsRow from '@/components/DetailsRow'

const CouponDetailsModal = ({ activityid }) => {
  const { CheckCouponDetails } = useModel('Coupon')
  const [detailsData, setDetailsData] = useState({}) // 详情数据

  useEffect(() => {
    getDetailsData()
  }, [])

  // 获取详情数据
  const getDetailsData = async () => {
    const res = await CheckCouponDetails(activityid)
    let distribrolesType = {
      1: '学生',
      2: '老师',
      5: '客服'
    }
    res.distribroles = res.distribroles.map(item => {
      return distribrolesType[item] + (item === res.distribroles[res.distribroles.length - 1] ? '' : '、')
    })
    setDetailsData(res)
  }

  return (
    <>
      {detailsData ? (
        <div className='coupon_details_modal'>
          <DetailsRow title='优惠券名称'>{detailsData.name}</DetailsRow>
          <DetailsRow title='优惠券有效期'>
            {detailsData.effectivetime} ~ {detailsData.expirestime}
          </DetailsRow>
          <DetailsRow title='领取次数限制'>{detailsData.claimlimt}</DetailsRow>
          <DetailsRow title='优惠券金额'>{detailsData.discount}</DetailsRow>
          <DetailsRow title='派发人群'>{detailsData.distribroles}</DetailsRow>
          <DetailsRow title='优惠券图片'>
            <Image width={100} style={{ borderRadius: '10px' }} src={detailsData.couponimage} alt='优惠券' />
          </DetailsRow>
          <DetailsRow title='使用说明'>{detailsData.instruction}</DetailsRow>
          <DetailsRow title='取消订阅配置'>
            <>
              {detailsData.unsubset &&
                detailsData.unsubset.length &&
                detailsData.unsubset.map(item => {
                  return (
                    <Space key={item}>
                      {item === 1 && <Tag>退款时失效</Tag>}
                      {item === 2 && <Tag>立即启用</Tag>}
                    </Space>
                  )
                })}
            </>
          </DetailsRow>
        </div>
      ) : (
        <Empty />
      )}
    </>
  )
}
export default CouponDetailsModal
