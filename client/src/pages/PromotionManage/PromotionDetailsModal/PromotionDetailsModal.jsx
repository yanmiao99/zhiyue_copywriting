import './PromotionDetailsModal.less'
import React, { useRef, useState } from 'react'
import { ProTable } from '@ant-design/pro-components'
import DetailsBox from '@/components/DetailsBox'

const PromotionDetailsModal = ({ res }) => {
  const [dataList, setDataList] = useState([]) //  列表数据
  const tableRef = useRef()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '电话',
      dataIndex: 'phone',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '名称',
      dataIndex: 'name',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '推广人数',
      dataIndex: 'promotedcnt',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '是否完成',
      dataIndex: 'ifdone',
      hideInSearch: true,
      align: 'center',
      valueEnum: {
        0: {
          text: '未完成',
          status: 'Warning'
        },
        1: {
          text: '已完成',
          status: 'Success'
        }
      }
    },
    {
      title: '奖励是否发放',
      dataIndex: 'awarded',
      hideInSearch: true,
      align: 'center',
      valueEnum: {
        0: {
          text: '未发放',
          status: 'Warning'
        },
        1: {
          text: '已发放',
          status: 'Success'
        }
      }
    }
  ]

  return (
    <div className='promotion_details_modal'>
      <div className='promotion_details_modal_box'>
        {dataList &&
          dataList.length &&
          dataList.map((item, index) => {
            return <DetailsBox item={item} key={index} />
          })}
      </div>

      <ProTable
        actionRef={tableRef}
        request={async params => {
          let tempArr = [
            {
              title: '参加推广人数',
              number: res.joincnt,
              color: '#9273FF'
            },
            {
              title: '推广人数',
              number: res.promotedcnt,
              color: '#00C26E'
            },
            {
              title: '完成1次及以上推广任务的人数',
              number: res.moreonecnt,
              color: '#9273FF'
            },
            {
              title: '推广任务计划完成比率',
              number: res.donecnt,
              color: '#FF6B00',
              subTitle: '计划完成',
              subNumber: res.planval,
              subUnit: '人'
            }
          ]

          setDataList(tempArr)

          return {
            data: res.userlist,
            success: true,
            total: res.userlist.length
          }
        }}
        options={{
          fullScreen: false,
          reload: false,
          setting: false,
          density: false
        }}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowKey='id'
        columns={columns}
        search={false}
      />
    </div>
  )
}
export default PromotionDetailsModal
