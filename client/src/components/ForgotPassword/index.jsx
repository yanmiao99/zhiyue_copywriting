import React from 'react'
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components'
import { MobileOutlined, LockOutlined } from '@ant-design/icons'
import { Button, App } from 'antd'
import { useModel } from '@umijs/max'

const ForgotPassword = ({ setPageStatus, PAGE_STATUS }) => {
  const { message } = App.useApp()
  const { GetForgetCaptcha, BASE_COLOR } = useModel('Global')

  const handleBackLogin = () => {
    setPageStatus(PAGE_STATUS.LOGIN)
  }

  const handleResetPassword = async values => {
    setPageStatus({
      ...PAGE_STATUS.SET_NEW_PASSWORD,
      phone: values.phone,
      code: values.code
    })
  }

  return (
    <LoginForm
      style={{ marginTop: 80 }}
      onFinish={values => handleResetPassword(values)}
      submitter={{
        render: (props, doms) => {
          return [
            <Button size='large' block type='primary' key='submit' onClick={() => props.form?.submit?.()}>
              下一步
            </Button>
          ]
        }
      }}
      actions={
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              color: BASE_COLOR,
              cursor: 'pointer'
            }}
            onClick={handleBackLogin}
          >
            返回账号登录
          </span>
        </div>
      }
    >
      <ProFormText
        fieldProps={{
          size: 'large',
          prefix: <MobileOutlined className={'prefixIcon'} />
        }}
        name='phone'
        placeholder={'手机号'}
        rules={[
          {
            required: true,
            message: '请输入手机号！'
          },
          {
            pattern: /^1\d{10}$/,
            message: '手机号格式错误！'
          }
        ]}
      />
      <ProFormCaptcha
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />
        }}
        captchaProps={{
          size: 'large'
        }}
        placeholder={'请输入验证码'}
        captchaTextRender={(timing, count) => {
          if (timing) {
            return `${count} ${'获取验证码'}`
          }
          return '获取验证码'
        }}
        name='code'
        phoneName='phone'
        rules={[
          {
            required: true,
            message: '请输入验证码！'
          }
        ]}
        onGetCaptcha={async phone => {
          await GetForgetCaptcha({ phone })
          message.success('获取验证码成功,请注意查收')
        }}
      />
    </LoginForm>
  )
}
export default ForgotPassword
