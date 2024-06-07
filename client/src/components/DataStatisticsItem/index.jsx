import { useCountUp } from 'react-countup'
import React, { useRef, useEffect } from 'react'
import './index.less'

const COLOR_TYPE = {
  down: {
    color: '#6C63FF',
    className: 'triangle_down'
  },
  up: {
    color: '#FF751A',
    className: 'triangle_up'
  }
}

const DataStatisticsItem = ({ data }) => {
  let { title, count, today, yesterday, color, surplus } = data
  const countRef = useRef(null)
  const numberAnimation = useCountUp({
    ref: countRef,
    start: 0,
    end: 0,
    duration: 1.5
  })

  useEffect(() => {
    numberAnimation.update(count)
  }, [])

  return (
    <div className='data_statistics_item'>
      <div className='data_statistics_item_title'>{title}</div>
      <div className='data_statistics_item_content' style={{ color }} ref={countRef}></div>
      <div className='data_statistics_item_trend'>
        {(today || today === 0) && (
          <div className='data_statistics_item_trend_item '>
            今日
            <span style={{ color: today > 0 ? COLOR_TYPE.up.color : COLOR_TYPE.down.color }}>{today}</span>
            <div className={`triangle ${today > 0 ? COLOR_TYPE.up.className : COLOR_TYPE.down.className}`}></div>
          </div>
        )}

        {(yesterday || yesterday === 0) && (
          <div className='data_statistics_item_trend_item '>
            昨日
            <span style={{ color: yesterday > 0 ? COLOR_TYPE.up.color : COLOR_TYPE.down.color }}>{yesterday}</span>
            <div className={`triangle ${yesterday > 0 ? COLOR_TYPE.up.className : COLOR_TYPE.down.className}`}></div>
          </div>
        )}

        {surplus && (
          <div className='data_statistics_item_trend_item '>
            剩余
            <span style={{ color: COLOR_TYPE.down.color }}>{surplus}</span>
          </div>
        )}
      </div>
    </div>
  )
}
export default DataStatisticsItem
