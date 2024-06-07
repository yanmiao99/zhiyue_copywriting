import React, { useEffect, useState } from 'react'
import './H5Share.less'
import { App, Empty } from 'antd'
import { useModel, useParams } from '@umijs/max'
import { DEFAULT_LOGO } from '@/constants'
import AwakenApp from '@/components/AwakenApp'

const H5Share = () => {
  const { GetNoteDetail, GetVideoDetail } = useModel('H5Share')
  const { message } = App.useApp()
  const [detailData, setDetailData] = useState({})
  const { type, id } = useParams()

  useEffect(() => {
    if (type === 'note') {
      getNoteDetail()
    } else if (type === 'video') {
      getVideoDetail()
    }
  }, [])

  // 获取笔记详情
  const getNoteDetail = async () => {
    const res = await GetNoteDetail(id)
    setDetailData(res)
  }

  // 获取视频详情
  const getVideoDetail = async () => {
    const res = await GetVideoDetail(id)
    // console.log('res========', res)
    setDetailData(res)
  }

  return (
    <div className='h5_share'>
      {detailData && JSON.stringify(detailData) !== '{}' ? (
        <>
          <div className='share_header'>
            <img src={DEFAULT_LOGO} alt='logo' />
            <AwakenApp noteId={id} />
          </div>
          <div className='share_content'>
            <div className='content_title'>
              <h1>{detailData.title}</h1>
            </div>
            {type === 'note' && (
              <div className='content_note_body' dangerouslySetInnerHTML={{ __html: detailData.content }}></div>
            )}
            {type === 'video' && (
              <div className='content_video_body'>
                <video src={detailData.videourl} controls autoPlay>
                  您的浏览器不支持 video 标签
                </video>
              </div>
            )}
          </div>
          <div className='share_info'>
            <span>编辑于 : {detailData.updatetime}</span>
            <span>IP属地 : {detailData.ipregion}</span>
            <span>著作权归作者所有</span>
          </div>
          <div className='share_footer'>
            <AwakenApp
              id={id}
              type={type}
              style={{
                width: '300px',
                height: '40px',
                margin: '0 auto'
              }}
            />
          </div>
        </>
      ) : (
        <div className='empty'>
          <Empty description={'分享的数据出错啦 ~ '} />
        </div>
      )}
    </div>
  )
}

export default H5Share
