import styles from './Login.less'
import { useModel, useSearchParams, history } from '@umijs/max'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components'
import { App } from 'antd'
import { useEffect, useState } from 'react'
import { setCookie, getDomain, setAccessToken, setUserInfo } from '@/utils/utils'
import { DEFAULT_LOGO } from '@/constants'

const Login = () => {
  const { message } = App.useApp()
  const { Login, setIsLoading, BASE_COLOR, GetUserInfo } = useModel('Global')
  const [searchParams] = useSearchParams()
  const [loginType, setLoginType] = useState('account')
  const [hideImg, setHideImg] = useState(false)

  useEffect(() => {
    window.addEventListener('resize', () => {
      handleClientWidth()
    })

    handleClientWidth()

    return () => {
      // 卸载
      window.removeEventListener('resize', () => {
        handleClientWidth()
      })
    }
  }, [document.body.clientWidth])

  const handleClientWidth = () => {
    if (document.body.clientWidth >= 1440) {
      setHideImg(false)
    } else {
      setHideImg(true)
    }
  }

  const handleLoginSuccessFn = async (res, autoLogin) => {
    setIsLoading(false)
    const target = searchParams.get('target') || '/manage'
    message.success('登录成功')
    setAccessToken(res.token, autoLogin)
    setCookie('autoL', autoLogin, getDomain(), autoLogin)

    const userInfo = await GetUserInfo()
    setUserInfo(userInfo)

    history.push(target || '/manage')
  }

  const handleSubmit = async values => {
    setIsLoading(true)
    const { autoLogin } = values

    if (loginType === 'account') {
      let params = {
        email: values.email,
        password: values.password,
        platform: 'server'
      }

      const res = await Login(params)
      handleLoginSuccessFn(res, autoLogin)
    }

    setIsLoading(false)
  }

  return (
    <div className={styles.login_content}>
      {/* <img className={styles.login_logo} src={DEFAULT_LOGO} alt='logo' /> */}
      {hideImg ? null : <div className={styles.login_content_left}></div>}
      <div
        className={styles.login_form_block}
        style={{
          right: !hideImg ? '40px' : '50%',
          transform: !hideImg ? 'translateX(0)' : 'translateX(50%)'
        }}
      >
        <div className={styles.login_form_title}>欢迎回来</div>
        <div className={styles.login_form_sub_title}>用心诉说，用字传情</div>

        <LoginForm
          initialValues={{
            autoLogin: false
          }}
          onFinish={async values => {
            handleSubmit(values)
          }}
          // actions={
          // }
        >
          {loginType === 'account' && (
            <div
              style={{
                marginBlockStart: 50
              }}
            >
              <ProFormText
                name='email'
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />
                }}
                placeholder={'邮箱'}
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱'
                  }
                ]}
              />
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
                  }
                ]}
              />
            </div>
          )}
          <div
            style={{
              marginBlockEnd: 24
            }}
          >
            <ProFormCheckbox noStyle name='autoLogin'>
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
                color: BASE_COLOR
              }}
            >
              忘记密码?
            </a>
          </div>
        </LoginForm>
      </div>
    </div>
  )
}

export default Login
