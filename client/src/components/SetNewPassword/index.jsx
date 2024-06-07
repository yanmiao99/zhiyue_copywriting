import React from 'react'
import { LoginForm, ProFormText } from '@ant-design/pro-components'
import { LockOutlined } from '@ant-design/icons'
import { Button, App } from 'antd'
import { useModel } from '@umijs/max'

const ForgotPassword = ({ setPageStatus, pageStatus, PAGE_STATUS }) => {
  const { message } = App.useApp()
  const { ResetPassword } = useModel('Global')

  const handleSetNewPassword = async values => {
    if (!pageStatus.phone || !pageStatus.code) {
      message.error('页面非法访问！')
      setPageStatus(PAGE_STATUS.LOGIN)
      return
    }

    let params = {
      phone: pageStatus.phone,
      code: pageStatus.code,
      password: values.password
    }

    await ResetPassword(params)
    setPageStatus(PAGE_STATUS.RESET_SUCCESS)
  }

  return (
    <LoginForm
      style={{ marginTop: 80 }}
      onFinish={values => handleSetNewPassword(values)}
      submitter={{
        render: (props, doms) => {
          return [
            <Button size='large' block type='primary' key='submit' onClick={() => props.form?.submit?.()}>
              重置密码
            </Button>
          ]
        }
      }}
    >
      <ProFormText.Password
        name='password'
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />
        }}
        placeholder={'密码:'}
        rules={[
          {
            required: true,
            message: '请输入密码！'
          },
          {
            min: 6,
            message: '密码最少6位！'
          }
        ]}
      />
      <ProFormText.Password
        name='password_confirmation'
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />
        }}
        placeholder={'重复密码:'}
        rules={[
          {
            required: true,
            message: '请二次输入密码！'
          },
          {
            min: 6,
            message: '密码最少6位！'
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject('两次密码输入不一致！')
            }
          })
        ]}
      />
    </LoginForm>
  )
}
export default ForgotPassword
