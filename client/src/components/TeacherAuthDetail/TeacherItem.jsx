import './index.less'

const TeacherItem = ({ title, children }) => {
  return (
    <div className='teacher_item'>
      <div className='teacher_title'>{title}</div>
      <div className='teacher_box'>{children}</div>
    </div>
  )
}

export default TeacherItem
