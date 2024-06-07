import React, { useEffect, useState } from 'react'
import { useModel } from '@umijs/max'
import { Empty, Image } from 'antd'
import DetailsRow from '@/components/DetailsRow'
import dayjs from 'dayjs'

const CouponDetailsModal = ({ deleteId }) => {
  const { CheckAnnouncementDetails } = useModel('NoticeAnnounce')
  const [detailsData, setDetailsData] = useState({}) // 详情数据

  useEffect(() => {
    getDetailsData()
  }, [])

  // 获取详情数据
  const getDetailsData = async () => {
    const res = await CheckAnnouncementDetails(deleteId)
    setDetailsData(res)
  }

  return (
    <>
      {detailsData ? (
        <div className='notice_details_modal'>
          <DetailsRow title='通知名称'>{detailsData.title}</DetailsRow>
          <DetailsRow title='通知开始时间'>{dayjs(detailsData.starttime).format('YYYY-MM-DD HH:mm:ss')}</DetailsRow>
          <DetailsRow title='通知人员'>
            <>
              {detailsData.tousertype === 1 && <span>学生</span>}
              {detailsData.tousertype === 2 && <span>老师</span>}
              {detailsData.tousertype === 3 && <span>全部</span>}
            </>
          </DetailsRow>
          <DetailsRow title='通知图片'>
            <Image
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '5px',
                marginRight: '5px',
                objectFit: 'cover'
              }}
              src={detailsData.images?.[0]}
            />
          </DetailsRow>
          <DetailsRow title='通知内容'>
            <Image
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '5px',
                marginRight: '5px',
                objectFit: 'cover'
              }}
              src={detailsData.content}
            />
          </DetailsRow>
        </div>
      ) : (
        <Empty />
      )}
    </>
  )
}
export default CouponDetailsModal
