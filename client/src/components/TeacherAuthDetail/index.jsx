import './index.less'
import TeacherItem from './TeacherItem'
import { Image, Empty, Tag } from 'antd'

const TeacherAuthDetail = ({ data }) => {
  console.log('data========', data)

  return (
    <div className='teacher_auth_detail'>
      <TeacherItem title='老师视频/图片'>
        {data.introducts && data.introducts.length ? (
          <div>
            <div className='teacher_image_wrapper' style={{ marginTop: '10px' }}>
              {data.introducts.map((item, index) => {
                return (
                  <div className='teacher_image' key={index}>
                    <Image className='image' width={'100%'} height={200} src={item} />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <Empty description='暂无身份证照片' />
        )}
      </TeacherItem>
      <TeacherItem title='老师信息'>
        <p className='teacher_sub_title'>
          姓名
          <span className='teacher_text_content'>{data.name ? data.name : '--'}</span>
        </p>
        <p className='teacher_sub_title'>
          性别
          <span className='teacher_text_content'>
            {data.gender ? (data.gender === 'male' ? '男' : data.gender === 'female' ? '女' : '--') : '--'}
          </span>
        </p>
        <p className='teacher_sub_title'>
          年龄
          <span className='teacher_text_content'>{data.age ? data.age : '--'}</span>
        </p>
        <p className='teacher_sub_title'>
          身份证
          <span className='teacher_text_content'>{data.idcard ? data.idcard : '--'}</span>
        </p>

        {data.idcardimages && data.idcardimages.length ? (
          <div>
            <div className='teacher_image_wrapper' style={{ marginTop: '10px' }}>
              {data.idcardimages.map((item, index) => {
                return (
                  <div className='teacher_image' key={index}>
                    <Image className='image' width={'100%'} height={200} src={item} />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <Empty description='暂无身份证照片' />
        )}
      </TeacherItem>
      <TeacherItem title='教学技能'>
        <>
          {data.skills && data.skills.length ? (
            <div>
              {data.skills.map((item, index) => {
                return (
                  <Tag color='#6C63FF' key={index}>
                    {item}
                  </Tag>
                )
              })}
            </div>
          ) : (
            <Empty description='暂无教学技能' />
          )}
        </>
      </TeacherItem>
      <TeacherItem title='教龄'>
        <p className='teacher_sub_title'>
          教龄
          <span className='teacher_text_content'>{data.teacherage ? data.teacherage + '年' : '--'}</span>
        </p>
      </TeacherItem>
      <TeacherItem title='可授课语言'>
        <p className='teacher_sub_title'>
          语言
          <span className='teacher_text_content'>{data.instructlang ? data.instructlang : '--'}</span>
        </p>
      </TeacherItem>
      <TeacherItem title='学习经历'>
        {/* 毕业证书  */}
        {data.graduatecerts && data.graduatecerts.length ? (
          <div>
            <div className='teacher_image_wrapper' style={{ marginTop: '10px' }}>
              {data.graduatecerts.map((item, index) => {
                return (
                  <div className='teacher_image' key={index}>
                    <Image className='image' width={'100%'} height={200} src={item} />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <Empty description='学习经历' />
        )}
      </TeacherItem>
      <TeacherItem title='证书'>
        <>
          {/* 教师资格证  */}
          {data.teachercerts && data.teachercerts.length ? (
            <div>
              <div className='teacher_sub_title'>教师资格证</div>
              <div className='teacher_image_wrapper'>
                {data.teachercerts.map((item, index) => {
                  return (
                    <div className='teacher_image' key={index}>
                      <Image className='image' width={'100%'} height={200} src={item} />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <Empty description='暂无教师资格证' />
          )}

          {/* CPA  */}
          {data.cpacerts && data.cpacerts.length ? (
            <div>
              <div className='teacher_sub_title'>CPA证书</div>
              <div className='teacher_image_wrapper'>
                {data.cpacerts.map((item, index) => {
                  return (
                    <div className='teacher_image' key={index}>
                      <Image className='image' width={'100%'} height={200} src={item} />
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <Empty description='暂无CPA' />
          )}
        </>
      </TeacherItem>
      <TeacherItem title='职业生活'>
        <p className='teacher_text'>{data.comment ? data.comment : '--'}</p>
      </TeacherItem>
      <TeacherItem title='个人简介'>
        <p className='teacher_text'>{data.resume ? data.resume : '--'}</p>
      </TeacherItem>
    </div>
  )
}

export default TeacherAuthDetail
