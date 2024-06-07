import PayTop5 from '@/components/PayTop5'
import SalesTop5 from '@/components/SalesTop5'
import TeacherStatistics from '@/components/TeacherStatistics'
import TeacherDataBox from '@/components/TeacherDataBox'
import './TeacherDataPanel.less'

const TeacherDataPanel = () => {
  return (
    <div className='teacher_data'>
      <div className='teacher_data_statistics'>
        <TeacherStatistics />
      </div>
      <div className='teacher_data_course_data'>
        <div className='data_title'>课程数据</div>
        <TeacherDataBox />
      </div>

      <div className='teacher_data_table'>
        <div className='teacher_data_table_item'>
          <div className='data_title'>销售量TOP5课程</div>
          <SalesTop5 />
        </div>
        <div className='teacher_data_table_item'>
          <div className='data_title'>支付TOP5用户</div>
          <PayTop5 />
        </div>
      </div>
    </div>
  )
}
export default TeacherDataPanel
