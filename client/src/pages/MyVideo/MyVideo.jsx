import React, { useState, useRef, useEffect } from 'react'
import { useModel, history, useLocation } from '@umijs/max'
import { ProTable } from '@ant-design/pro-components'
import { Button, Image, Popconfirm, Space, App } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './MyVideo.less'

export default () => {
  const { GetVideoList, DeleteVideo } = useModel('MyVideo')
  const { message } = App.useApp()
  const location = useLocation()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(() => {
    return location.state?.currentPage || 1
  }) //  当前页码

  const tableRef = useRef()

  // 新增和编辑
  const handleAddAndEdit = (type, row) => {
    history.push('/manage/myVideo/myVideoAddAndEdit', {
      type,
      id: row?.id,
      currentRow: JSON.stringify(row),
      currentPage,
      currentPath: location.pathname
    })
  }

  // 删除
  const handleDeleteVideo = async row => {
    await DeleteVideo({ id: row.id })
    tableRef.current.reload()
    message.success('删除成功')
  }

  const originColumns = [
    {
      title: '封面',
      dataIndex: 'logourl',
      width: 150,
      align: 'center',
      hideInSearch: true,
      render: (_, row) => {
        return <Image width={150} style={{ borderRadius: '6px' }} src={row.logourl} />
      }
    },
    {
      title: '标题',
      width: 150,
      dataIndex: 'title',
      align: 'left',
      render: (_, row) => {
        return <div className='my_video_title'>{row.title}</div>
      }
    },
    {
      title: '审核完成时间',
      dataIndex: 'updatetime',
      width: 120,
      align: 'left',
      valueType: 'dateTimeRange',
      search: {
        transform: value => {
          return {
            start: value[0],
            end: value[1]
          }
        }
      },
      render: (_, row) => {
        return (
          <div className='my_video_time'>
            <div className='my_video_time_name'>上传完成时间</div>
            <div className='my_video_time_value'>{row.updatetime ? row.updatetime : '--'}</div>
            <div className='my_video_time_name'>审核完成时间</div>
            <div className='my_video_time_value'>{row.confirmtime ? row.confirmtime : '--'}</div>
          </div>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      align: 'center',
      valueEnum: {
        1: {
          text: '草稿',
          status: 'Warning'
        },
        2: {
          text: '审核中',
          status: 'Processing'
        },
        3: {
          text: '审核通过',
          status: 'Success'
        },
        4: {
          text: '审核未通过',
          status: 'Error'
        }
      },
      render: (_, row) => {
        let { status } = row
        return (
          <div className='my_video_status'>
            {status === 1 && <span style={{ color: '#FF751A' }}>草稿</span>}
            {status === 2 && <span style={{ color: '#FF751A' }}>审核中</span>}
            {status === 3 && <span style={{ color: '#6C63FF' }}>审核通过</span>}
            {status === 4 && <span style={{ color: '#FE5055' }}>审核未通过</span>}
            {status === 4 ? <div style={{ color: '#FE5055' }}>原因：{row.rejectreason}</div> : null}
          </div>
        )
      }
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      fixed: 'right',
      align: 'right',
      render: (_, row) => {
        return (
          <Space>
            <Button type='primary' ghost onClick={() => handleAddAndEdit('edit', row)}>
              编辑
            </Button>

            <Popconfirm
              key='delete'
              title='确认删除吗？'
              onConfirm={() => handleDeleteVideo(row)}
              okText='确认'
              cancelText='取消'
            >
              <Button danger ghost type='primary'>
                删除
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        const filters = {
          title: params.title,
          start: params.start,
          end: params.end,
          status: Number(params.status)
        }

        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          sortk: '-updatetime',
          ...filters
        }

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetVideoList(param)
        const { list, total } = res

        return {
          data: list,
          success: true,
          total: total
        }
      }}
      pagination={{
        pageSize: pageSize,
        current: currentPage
      }}
      headerTitle={
        <Button
          icon={<PlusOutlined />}
          onClick={() => handleAddAndEdit('add')}
          key={Math.random().toString()}
          type='primary'
        >
          发布视频
        </Button>
      }
      scroll={{ x: 'max-content' }}
      rowKey='id'
      columns={originColumns}
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
        span: 12
      }}
    />
  )
}
