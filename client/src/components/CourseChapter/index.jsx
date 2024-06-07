import './index.less'
import { Button, Form, Input, InputNumber, Card, Popconfirm, Typography, App } from 'antd'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { forwardRef, useImperativeHandle, useEffect } from 'react'
import FormUploadVideoOSS from '@/components/FormUploadVideoOSS'
import { useModel } from '@umijs/max'

const CourseChapter = ({ echoValue }, ref) => {
  const [courseChapterFormRef] = Form.useForm()

  const { DelItemChapter, DelItemSection } = useModel('TeacherMyCourse')

  const { message } = App.useApp()

  // 处理回显数据
  useEffect(() => {
    if (echoValue) {
      let chapters = []
      if (echoValue.chapters && echoValue.chapters.length > 0) {
        chapters = echoValue.chapters.map(chapter => {
          let lessons = chapter.lessons.map(lesson => {
            return {
              ...lesson,
              videoInfo: {
                fileId: lesson.fileid,
                url: lesson.videourl,
                name: lesson.aliasname
              }
            }
          })
          return {
            ...chapter,
            lessons
          }
        })
      }
      courseChapterFormRef.setFieldsValue({
        chapters
      })
    }
  }, [echoValue])

  // 验证表单数据, 回传给父组件
  const handleValidateForm = async () => {
    await courseChapterFormRef.validateFields()
    return courseChapterFormRef.getFieldsValue()
  }

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    handleValidateForm
  }))

  return (
    <div className='course_chapter'>
      <Form
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        form={courseChapterFormRef}
        name='course_chapter_form'
        initialValues={{ chapters: [{}] }}
      >
        <Form.List name='chapters'>
          {(fields, { add, remove }) => (
            <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
              {fields.map(field => (
                <Card
                  size='small'
                  title={`课程第${field.name + 1}章`}
                  key={field.key}
                  extra={
                    <Popconfirm
                      key='delete'
                      title='确认删除该章吗?'
                      onConfirm={async () => {
                        let chapterId = field.fieldKey
                        let allChapters = courseChapterFormRef.getFieldsValue()
                        let currentChapters = allChapters.chapters.find((item, index) => index === chapterId)
                        await DelItemChapter(currentChapters.chapterid)
                        remove(field.name)
                        message.success('删除成功')
                      }}
                      okText='确认'
                      cancelText='取消'
                    >
                      <CloseOutlined />
                    </Popconfirm>
                  }
                >
                  <Form.Item
                    label='章名称'
                    name={[field.name, 'title']}
                    rules={[{ required: true, message: '请输入章名称' }]}
                  >
                    <Input allowClear placeholder='请输入章名称' />
                  </Form.Item>

                  <Form.Item
                    label='章价格'
                    name={[field.name, 'price']}
                    rules={[{ required: true, message: '请输入章价格' }]}
                  >
                    <InputNumber style={{ width: '100%' }} placeholder='请输入章价格' addonAfter='元' />
                  </Form.Item>

                  <Form.Item label='课程节' required>
                    <Form.List name={[field.name, 'lessons']}>
                      {(subFields, subOpt) => (
                        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                          {subFields.map(subField => (
                            <div key={subField.key}>
                              <Popconfirm
                                key='delete'
                                title='确认删除该节课程吗?'
                                onConfirm={async () => {
                                  let chapterId = field.fieldKey
                                  let allChapters = courseChapterFormRef.getFieldsValue()
                                  let currentChapters = allChapters.chapters.find((item, index) => index === chapterId)
                                  let lessonId = subField.fieldKey
                                  let currentLessons = currentChapters.lessons.find((item, index) => index === lessonId)

                                  await DelItemSection(currentLessons.lessonid)
                                  subOpt.remove(subField.name)
                                  message.success('删除成功')
                                }}
                                okText='确认'
                                cancelText='取消'
                              >
                                <Button ghost type='dashed' danger block style={{ marginBottom: 16 }}>
                                  <CloseOutlined />
                                  <span>删除节</span>
                                </Button>
                              </Popconfirm>

                              <Form.Item
                                label='节名称'
                                name={[subField.name, 'title']}
                                rules={[{ required: true, message: '请输入节名称' }]}
                              >
                                <Input allowClear placeholder='请输入节名称' />
                              </Form.Item>

                              <FormUploadVideoOSS
                                label='节视频'
                                required
                                name={[subField.name, 'videoInfo']}
                                videoSignType='course'
                              />
                            </div>
                          ))}
                          <Button type='primary' ghost onClick={() => subOpt.add()} block icon={<PlusOutlined />}>
                            点击添加节课程
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}

              <Button type='primary' ghost onClick={() => add()} block icon={<PlusOutlined />}>
                点击添加章课程
              </Button>
            </div>
          )}
        </Form.List>

        {/* <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(courseChapterFormRef.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item> */}
      </Form>
    </div>
  )
}
export default forwardRef(CourseChapter)
