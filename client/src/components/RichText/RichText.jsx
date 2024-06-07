import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { useModel } from '@umijs/max'
import { App } from 'antd'

export default props => {
  const { message } = App.useApp()

  const { value, onChange, disabled } = props

  const { UPLOAD_URL } = useModel('Global')

  // editor 实例
  const [editor, setEditor] = useState(null)

  // 编辑器内容
  const [html, setHtml] = useState(null)

  // 处理数据回显
  useEffect(() => {
    if (value) {
      setTimeout(() => {
        handleChange(value)
      }, 100)
    }
  }, [])

  // 工具栏配置
  const toolbarConfig = {}

  // 编辑器配置
  const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {}
  }

  // 更改编辑器内容
  const handleChange = html => {
    setHtml(html)
    onChange(html)
  }

  // 处理图片上传
  editorConfig.MENU_CONF['uploadImage'] = {
    fieldName: 'file',
    // 单个文件的最大体积限制，默认为 2M
    maxFileSize: 2 * 1024 * 1024,
    // 最多可上传几个文件，默认为 100
    maxNumberOfFiles: 10,
    // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
    // 服务地址
    server: UPLOAD_URL,
    // 自定义插入图片
    customInsert(res, insertFn) {
      if (res.code === 200) {
        const { img_url } = res.data
        insertFn(img_url, '', '')
      } else {
        message.error(res.msg)
      }
    },
    // 单个文件上传成功之后
    onSuccess(file, res) {
      message.success(`${file.name} 上传成功`)
    },

    // 单个文件上传失败
    onFailed(file, res) {
      message.error(`${file.name} 上传失败`)
    },

    // 上传错误，或者触发 timeout 超时
    onError(file, err, res) {
      message.error('文件大小不能超过2M, 请重新上传')
    }
  }

  // 处理toolbar菜单
  toolbarConfig.excludeKeys = [
    // 分割线
    '|',
    // 视频
    'group-video'
  ]

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode='default'
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={editor => handleChange(editor.getHtml())}
          mode='default'
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
    </>
  )
}
