import React, { useState, useRef, useEffect } from 'react'
import { useModel, history, useLocation } from '@umijs/max'
import { Button, Image, Popconfirm, Space, App, Tag, Select } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import { PlusOutlined } from '@ant-design/icons'
import './TeacherMyCourse.less'

export default () => {
  const { GetTeacherCourseList, GetCourseCategory, DeleteCourse } = useModel('TeacherMyCourse')
  const { message } = App.useApp()
  const location = useLocation()

  const [pageSize, setPageSize] = useState(10) //  每页数量
  const [currentPage, setCurrentPage] = useState(() => {
    return location.state?.currentPage || 1
  }) //  当前页码

  const [allCourseCategory, setAllCourseCategory] = useState([]) // 所有的课程
  const [courseCategory, setCourseCategory] = useState({}) // 课程大类

  const tableRef = useRef()

  // 获取课程类别
  const getCourseCategory = async () => {
    const res = await GetCourseCategory()
    const obj = res.list.reduce((acc, item) => {
      acc[item.category] = {
        text: item.category
      }
      return acc
    }, {})
    setCourseCategory(obj)
    setAllCourseCategory(res.list)
  }

  // 新增和编辑
  const handleAddAndEdit = (type, row) => {
    history.push('/manage/teacherMyCourse/teacherCourseAddAndEdit', {
      type,
      id: row?.id,
      currentPage,
      currentPath: location.pathname
    })
  }

  // 删除
  const handleDelete = async row => {
    await DeleteCourse(row.id)
    tableRef.current.reload()
    message.success('删除成功')
  }

  const originColumns = [
    {
      title: '封面',
      dataIndex: 'logourl',
      width: 150,
      align: 'center',
      hideInSearch: true,
      render: (_, row) => {
        return <Image width={150} style={{ borderRadius: '6px' }} src={row.logourl} />
      }
    },
    {
      title: '标题',
      width: 150,
      dataIndex: 'title',
      align: 'left',
      render: (_, row) => {
        return (
          <div>
            <div className='teacher_my_course_title'>{row.title}</div>
            <div className='teacher_my_course_tag'>
              <span className='teacher_my_course_tag_title'>课程分类</span>
              <Tag color='blue'>
                {row.category} - {row.classify}
              </Tag>
            </div>
          </div>
        )
      }
    },
    {
      title: '时间',
      dataIndex: 'time',
      width: 120,
      align: 'left',
      valueType: 'dateTimeRange',
      search: {
        transform: value => {
          return {
            start: value[0],
            end: value[1]
          }
        }
      },
      render: (_, row) => {
        return (
          <div className='teacher_my_course_time'>
            <div className='teacher_my_course_time_name'>上传完成时间</div>
            <div className='teacher_my_course_time_value'>{row.createtime ? row.createtime : '--'}</div>
            <div className='teacher_my_course_time_name'>审核完成时间</div>
            <div className='teacher_my_course_time_value'>{row.confirmtime ? row.confirmtime : '--'}</div>
          </div>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      align: 'right',
      valueEnum: {
        1: {
          text: '草稿',
          status: 'Warning'
        },
        2: {
          text: '审核中',
          status: 'Processing'
        },
        3: {
          text: '审核通过',
          status: 'Success'
        },
        4: {
          text: '审核未通过',
          status: 'Error'
        }
      },
      render: (_, row) => {
        let { status } = row
        return (
          <div className='teacher_my_course_status'>
            <div className='teacher_my_course_price'>
              <div className='price_title'>总价格(元)</div>
              <div className='price_num'>{row.price}</div>
            </div>

            {status === 1 && <span style={{ color: '#FF751A' }}>草稿</span>}
            {status === 2 && <span style={{ color: '#FF751A' }}>审核中</span>}
            {status === 3 && <span style={{ color: '#6C63FF' }}>审核通过</span>}
            {status === 4 && <span style={{ color: '#FE5055' }}>审核未通过</span>}
            {status === 4 ? <div style={{ color: '#FE5055' }}>原因：{row.rejectreason}</div> : null}
          </div>
        )
      }
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      fixed: 'right',
      align: 'right',
      render: (_, row) => {
        return (
          <Space>
            <Button type='primary' ghost onClick={() => handleAddAndEdit('edit', row)}>
              编辑
            </Button>

            <Popconfirm
              key='delete'
              title='确认删除吗？'
              onConfirm={() => handleDelete(row)}
              okText='确认'
              cancelText='取消'
            >
              <Button danger ghost type='primary'>
                删除
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    },
    {
      title: '课程大类',
      dataIndex: 'category',
      hideInTable: true,
      valueType: 'select',
      valueEnum: courseCategory
    },
    {
      title: '课程小类',
      dataIndex: 'classify',
      hideInTable: true,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        let currentCategory = form.getFieldValue('category')
        const currentClassify = allCourseCategory.find(item => item.category === currentCategory)

        let classifyOption = []
        if (currentClassify && currentClassify.classifys.length) {
          currentClassify.classifys.forEach(item => {
            classifyOption.push({
              value: item,
              label: item
            })
          })
        }

        return <Select placeholder='请先选择课程大类' options={[...classifyOption]} />
      }
    }
  ]

  return (
    <ProTable
      actionRef={tableRef}
      request={async params => {
        const filters = {
          title: params.title,
          start: params.start,
          end: params.end,
          status: Number(params.status),
          category: params.category,
          classify: params.classify
        }

        const param = {
          offset: params.current * params.pageSize - params.pageSize,
          step: params.pageSize,
          sortk: '-createtime',
          ...filters
        }

        getCourseCategory()

        setCurrentPage(params.current)
        setPageSize(params.pageSize)
        const res = await GetTeacherCourseList(param)
        const { list, total } = res

        return {
          data: list,
          success: true,
          total: total
        }
      }}
      pagination={{
        pageSize: pageSize,
        current: currentPage
      }}
      headerTitle={
        <Button
          icon={<PlusOutlined />}
          onClick={() => handleAddAndEdit('add')}
          key={Math.random().toString()}
          type='primary'
        >
          发布课程
        </Button>
      }
      scroll={{ x: 'max-content' }}
      rowKey='id'
      columns={originColumns}
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
        span: 8
      }}
    />
  )
}
