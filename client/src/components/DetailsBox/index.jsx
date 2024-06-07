import { useCountUp } from 'react-countup'
import { useRef, useEffect } from 'react'
import './index.less'
import { useModel } from '@umijs/max'

const DetailsBox = ({ item }) => {
  const { BASE_COLOR } = useModel('Global')

  const countRef = useRef(null)
  const numberAnimation = useCountUp({
    ref: countRef,
    start: 0,
    end: 0,
    duration: 1.5
  })

  const compareRef = useRef(null)
  const compareNumberAnimation = useCountUp({
    ref: compareRef,
    start: 0,
    end: 0,
    duration: 1.5
  })

  useEffect(() => {
    if (item && item.number) {
      console.log('item.number========', item.number)

      numberAnimation.update(item.number)
      compareNumberAnimation.update(item.subNumber)
    }
  }, [])

  return (
    <>
      <div className='details_box_item'>
        <div className='details_box_item_title'>{item.title}</div>
        <div
          className='details_box_item_count'
          ref={countRef}
          style={{
            fontFamily: 'DINPro-Medium',
            color: item.color
          }}
        />

        {item.subTitle ? (
          <div className='details_box_item_compare'>
            <span>{item.subTitle}</span>
            <span
              className='details_box_item_compare_number'
              style={{
                fontFamily: 'DINPro-Medium',
                color: BASE_COLOR
              }}
              ref={compareRef}
            ></span>
            <span>{item.subUnit}</span>
          </div>
        ) : null}
      </div>
    </>
  )
}
export default DetailsBox
