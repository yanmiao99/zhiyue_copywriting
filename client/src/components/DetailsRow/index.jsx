import './index.less'
const DetailsRow = ({ title, children }) => {
  return (
    <div className='details_row'>
      <div className='details_title'>{title}</div>
      <div className='details_content'>{children}</div>
    </div>
  )
}
export default DetailsRow
