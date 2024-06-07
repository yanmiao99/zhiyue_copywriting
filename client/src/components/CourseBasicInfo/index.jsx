import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, Input, Select, InputNumber, DatePicker } from 'antd'
import FormUploadImg from '@/components/FormUploadImg'
import './index.less'

const { TextArea } = Input
const { RangePicker } = DatePicker
import dayjs from 'dayjs'
import { useModel } from '@umijs/max'
import { useEffect, useState } from 'react'

const CourseBasicInfo = ({ echoValue }, ref) => {
  const [courseBasicFormRef] = Form.useForm()
  const { GetCourseCategory } = useModel('TeacherMyCourse')
  const [courseCategoryList, setCourseCategoryList] = useState([])

  useEffect(() => {
    getCourseCategoryList()
  }, [])

  // 处理回显数据
  useEffect(() => {
    if (echoValue) {
      let { logourl, title, price, starttime, endtime, introduce, category, classify } = echoValue
      let time = [dayjs(starttime), dayjs(endtime)]

      courseBasicFormRef.setFieldsValue({
        logourl,
        title,
        price,
        time,
        introduce,
        courseCategory: {
          category,
          classify
        }
      })
    }
  }, [echoValue])

  // 获取课程分类
  const getCourseCategoryList = async () => {
    let res = await GetCourseCategory()
    setCourseCategoryList(res.list)
  }

  // 更改课程分类的选择
  const handleChangeCourseCategory = value => {
    courseBasicFormRef.setFieldValue('courseCategory', {
      category: value,
      classify: []
    })
  }

  // 验证表单数据, 回传给父组件
  const handleValidateForm = async () => {
    await courseBasicFormRef.validateFields()
    let values = courseBasicFormRef.getFieldsValue()
    let { time, courseCategory } = values
    let starttime = dayjs(time[0]).format('YYYY-MM-DD HH:mm:ss')
    let endtime = dayjs(time[1]).format('YYYY-MM-DD HH:mm:ss')

    let params = {
      ...values,
      ...courseCategory,
      starttime,
      endtime
    }

    delete params.time
    delete params.courseCategory

    return params
  }

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    handleValidateForm
  }))

  return (
    <div className='course_basic_info'>
      <Form
        preserve={false}
        form={courseBasicFormRef}
        name='CourseBasic'
        layout='vertical'
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 24 }}
        initialValues={{}}
      >
        <FormUploadImg required name='logourl' label='课程封面' />

        <Form.Item name='title' label='课程名称: ' rules={[{ required: true, message: '请输入课程名称' }]}>
          <Input placeholder='请输入课程名称' allowClear />
        </Form.Item>

        <Form.Item label='课程分类' required>
          <div className='course_category'>
            <Form.Item
              name={['courseCategory', 'category']}
              noStyle
              rules={[{ required: true, message: '请选择课程大类' }]}
            >
              <Select
                style={{ width: '49%' }}
                placeholder='请选择课程大类'
                onChange={handleChangeCourseCategory}
                options={
                  courseCategoryList.length > 0
                    ? courseCategoryList.map(item => {
                        return { label: item.category, value: item.category }
                      })
                    : []
                }
              />
            </Form.Item>

            <Form.Item shouldUpdate noStyle>
              {() => {
                // 每次监听到更改, 就更新 select 中的 options 的数据
                let currentSelectCourse = courseBasicFormRef.getFieldValue('courseCategory')
                let currentCategoryList = []

                if (currentSelectCourse) {
                  let categoryObj = courseCategoryList.find(item => item.category === currentSelectCourse.category)

                  if (categoryObj && categoryObj.classifys.length > 0) {
                    currentCategoryList = categoryObj.classifys
                  }
                }

                return (
                  <Form.Item
                    name={['courseCategory', 'classify']}
                    noStyle
                    rules={[{ required: true, message: '请选择课程小类' }]}
                  >
                    <Select
                      style={{ width: '49%' }}
                      placeholder='请选择课程小类'
                      options={
                        currentCategoryList.length > 0
                          ? currentCategoryList.map(item => {
                              return { label: item, value: item }
                            })
                          : []
                      }
                    />
                  </Form.Item>
                )
              }}
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item name='price' label='课程总价: ' rules={[{ required: true, message: '请输入课程总价' }]}>
          <InputNumber style={{ width: '100%' }} placeholder='请输入课程总价' addonAfter='元' />
        </Form.Item>

        <Form.Item name='time' label='课程时间' rules={[{ required: true, message: '开始时间和结束时间' }]}>
          <RangePicker showTime format='YYYY-MM-DD HH:mm:ss' style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name='introduce' label='课程介绍: ' rules={[{ required: true, message: '请输入课程介绍' }]}>
          <TextArea rows={4} placeholder='请输入课程介绍' allowClear />
        </Form.Item>
      </Form>
    </div>
  )
}
export default forwardRef(CourseBasicInfo)
