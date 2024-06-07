import { Button, Space, Upload, App, Popconfirm } from 'antd'
import { EditableProTable } from '@ant-design/pro-components'
import { useState, useRef } from 'react'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import styles from './PromotionCustomTable.less'
import { useModel } from '@umijs/max'
import { useEffect } from 'react'

const PromotionCustomTable = props => {
  const { onChange, value } = props

  // 回显数据
  useEffect(() => {
    setData(value)
  }, [value])

  const { message } = App.useApp()
  const [data, setData] = useState([])
  const [editableKeys, setEditableRowKeys] = useState([])
  const { BASE_COLOR } = useModel('Global')
  const actionRef = useRef()

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '账号',
      dataIndex: 'phone',
      align: 'center'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      fixed: 'right',
      render: (text, record, _, action) => {
        return (
          <Space>
            <Button
              type='link'
              style={{ color: BASE_COLOR }}
              onClick={() => {
                action?.startEditable?.(record.id)
              }}
            >
              编辑
            </Button>

            <Popconfirm title='确认删除吗？' onConfirm={() => handleDelete(record)} okText='确认' cancelText='取消'>
              <Button type='link' danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  // 处理导入 excel
  const handleImportExcel = file => {
    // 获取上传的文件对象
    const { files } = file.target
    // 通过FileReader对象读取文件
    const fileReader = new FileReader()
    fileReader.onload = event => {
      try {
        const { result } = event.target
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' })
        // 存储获取到的数据
        let tempData = []
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          // esline-disable-next-line
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            tempData = tempData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
            // break // 如果只取第一张表，就取消注释这行
          }
        }
        // 最终获取到并且格式化后的 json 数据
        const arr = tempData.map((item, index) => {
          item.id = Number(Date.now() + index)
          item.phone = item.phone.toString()
          return item
        })

        setData(arr)
        onChange(arr)

        message.success('上传成功！')
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        message.error('文件类型不正确或者文件已损坏,请重新上传！')
      }
    }
    // 销毁对象
    fileReader.onloadend = () => {
      fileReader.onload = null
      fileReader.onerror = null
      fileReader.onabort = null
      fileReader.onprogress = null
      fileReader.onloadend = null
    }
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0])
  }

  // 添加一行
  const handleCreateRow = () => {
    actionRef.current?.addEditRecord?.({
      id: Number((Math.random() * 1000000).toFixed(0))
    })
  }

  // 操作保存
  const handleSave = async (rowKey, row) => {
    const newData = [...data, row]
    onChange(newData)
  }

  // 操作删除
  const handleDelete = async record => {
    setData(d => d.filter(item => item.id !== record.id))
    let newData = data.filter(item => item.id !== record.id)
    onChange(newData)
  }

  return (
    <div>
      <Space>
        <Button type='primary' icon={<PlusOutlined />} onClick={handleCreateRow}>
          添加账号
        </Button>
        <div>
          <Button type='primary' className={styles.upload_wrap} icon={<UploadOutlined />}>
            <input className={styles.file_uploader} type='file' accept='.xlsx, .xls' onChange={handleImportExcel} />
            <span className={styles.upload_text}>上传文件</span>
          </Button>
          <span className={styles.upload_tip}>使用上传文件,会覆盖表格中原有的数据</span>
        </div>
      </Space>
      <EditableProTable
        style={{ marginTop: '20px' }}
        columns={columns}
        actionRef={actionRef}
        rowKey='id'
        scroll={{ x: 'max-content' }}
        value={data}
        onChange={setData}
        bordered
        recordCreatorProps={false}
        editable={{
          editableKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
          onChange: setEditableRowKeys,
          onSave: handleSave
        }}
      />
    </div>
  )
}
export default PromotionCustomTable
