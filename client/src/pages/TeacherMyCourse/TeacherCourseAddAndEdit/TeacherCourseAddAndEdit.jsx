import { useModel, useLocation } from '@umijs/max'
import { useEffect, useState, useRef } from 'react'
import BackPage from '@/components/BackPage'
import { App, Button, Form, Space } from 'antd'
import './TeacherCourseAddAndEdit.less'
import CourseBasicInfo from '@/components/CourseBasicInfo'
import CourseChapter from '@/components/CourseChapter'

const typeMap = {
  add: {
    title: '新建课程'
  },
  edit: {
    title: '编辑课程'
  }
}

const TeacherCourseAddAndEdit = () => {
  const { CourseSubmitAudit, CourseSaveDraft, GetCourseDetail } = useModel('TeacherMyCourse')

  const location = useLocation()
  const [currentType, setCurrentType] = useState('add') // 当前类型
  const [currentRow, setCurrentRow] = useState({}) // 当前行数据

  const { message } = App.useApp()
  const backPageRef = useRef()
  const courseBasicInfoRef = useRef()
  const courseChapterRef = useRef()

  // 回显数据
  const [courseBasicInfoEchoValue, setCourseBasicInfoEchoValue] = useState({})
  const [courseChapterEchoValue, setCourseChapterEchoValue] = useState({})

  useEffect(() => {
    if (location.state?.type) setCurrentType(location.state?.type)
    if (location.state?.id && location.state?.type === 'edit') {
      getCourseDetails(location.state?.id)
    }
  }, [])

  // 获取课程详情
  const getCourseDetails = async id => {
    const res = await GetCourseDetail(id)
    setCourseBasicInfoEchoValue(res)
    setCourseChapterEchoValue(res)
    setCurrentRow(res)

    // console.log('res========', res)
  }

  // 提交表单
  const handleSubmitForm = async type => {
    // 验证并且获取课程 基础信息
    let courseBasicInfo = await courseBasicInfoRef.current.handleValidateForm()
    // 验证并且获取课程 章节信息
    let courseChapter = await courseChapterRef.current.handleValidateForm()

    let params = {
      ...courseBasicInfo,
      ...courseChapter
    }

    // 遍历章节信息, 处理video的数据, 并且删除多余的字段
    params.chapters.forEach(chapter => {
      chapter.lessons.forEach(section => {
        section.fileid = section.videoInfo.fileId
        section.videourl = section.videoInfo.url
        section.aliasname = section.videoInfo.name
        delete section.videoInfo
      })
    })

    // console.log('params========', params)

    if (currentType === 'edit') {
      params = { ...currentRow, ...params }
    }

    type === 'submit' ? await CourseSubmitAudit(params) : await CourseSaveDraft(params)
    message.success('提交成功, 2秒后返回列表页')
    setTimeout(() => {
      backPageRef.current.handleBackGo()
    }, 2000)
  }

  return (
    <>
      <div className='add_and_edit_header'>
        <BackPage ref={backPageRef} />
        <h2>{typeMap[currentType] && typeMap[currentType].title}</h2>
        <Space>
          <Button style={{ background: '#FF751A' }} type='primary' onClick={() => handleSubmitForm('draft')}>
            暂存草稿
          </Button>
          <Button type='primary' onClick={() => handleSubmitForm('submit')}>
            提交审核
          </Button>
        </Space>
      </div>
      <div className='teacher_course_content'>
        <CourseBasicInfo ref={courseBasicInfoRef} echoValue={courseBasicInfoEchoValue} />
        <CourseChapter ref={courseChapterRef} echoValue={courseChapterEchoValue} />
      </div>
    </>
  )
}

export default TeacherCourseAddAndEdit
