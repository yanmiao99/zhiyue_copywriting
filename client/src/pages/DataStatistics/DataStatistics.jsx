import DataStatisticsWrapper from '@/components/DataStatisticsWrapper'
import HotCourseTop5 from '@/components/HotCourseTop5'
import DataPayTop5 from '@/components/DataPayTop5'
import TeacherTop5 from '@/components/TeacherTop5'
import './index.less'

export default () => {
  return (
    <div className='data_wrapper'>
      <div className='course_data'>
        <div className='data_title'>课程数据</div>
        <DataStatisticsWrapper />
      </div>
      <div className='data_table'>
        <div className='data_table_item' style={{ width: '100%' }}>
          <div className='data_title'>热门课程TOP5排行</div>
          <HotCourseTop5 />
        </div>
      </div>
      <div className='data_table'>
        <div className='data_table_item'>
          <div className='data_title'>老师TOP5排行</div>
          <TeacherTop5 />
        </div>

        <div className='data_table_item'>
          <div className='data_title'>付费TOP5排行</div>
          <DataPayTop5 />
        </div>
      </div>
    </div>
  )
}
