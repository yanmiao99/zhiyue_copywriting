import { useOutlet, useModel, Link, useLocation, Helmet } from 'umi'
import { useEffect, useState } from 'react'
import { ProLayout } from '@ant-design/pro-components'
import { Spin, ConfigProvider, App as AntdApp } from 'antd'
import AvatarMenu from '@/components/AvatarMenu'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import AntdGlobal from '@/utils/AntdGlobal'
import styles from './index.less'
import '@/app.less'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const BasicLayout = props => {
  const authRoute = props.authRoute
    ? props.authRoute.map(i => {
        if (!i.path) {
          i.path = '/'
        }
        return i
      })
    : []

  const location = useLocation()
  const { isLoading, platformType, setContentWidth, defaultName, BASE_COLOR, DEFAULT_LOGO, ICON_FONT_URL } =
    useModel('Global')
  const [collapsed, setCollapsed] = useState(false)
  const currentOutlet = useOutlet()

  useEffect(() => {
    window.addEventListener('resize', e => {
      calcContentWidth()
    })

    if (document.body.clientWidth >= 990) {
      setCollapsed(false)
    } else {
      setCollapsed(true)
    }
  }, [])

  useEffect(() => {
    calcContentWidth()
  }, [location.pathname])

  const handleCoolapse = () => {
    setTimeout(() => {
      calcContentWidth()
      setCollapsed(!collapsed)
    }, 200)
  }

  const calcContentWidth = () => {
    const ele = document.getElementsByClassName('ant-layout-content')[0]
    if (ele) {
      const clientWidth = ele.getBoundingClientRect().width
      setContentWidth(clientWidth)
    }
  }

  const handleGoToHome = () => {
    window.location.href = '/manage'
  }

  return (
    <ProLayout
      token={{
        header: {
          colorBgHeader: '#fff',
          colorTextMenuSecondary: '#dfdfdf',
          colorTextMenuSelected: '#fff',
          colorBgMenuItemSelected: '#F2F3F4',
          colorTextRightActionsItem: '#dfdfdf'
        },
        sider: {
          colorMenuBackground: '#fff',
          colorMenuItemDivider: '#dfdfdf',
          colorTextMenu: '#595959',
          colorTextMenuSelected: BASE_COLOR,
          colorBgMenuItemSelected: 'rgba(230,243,254,1)'
        }
      }}
      logo={() => <img src={DEFAULT_LOGO} alt='logo' style={{ height: '35px' }} onClick={handleGoToHome} />}
      title={defaultName}
      contentStyle={{ padding: 0 }}
      onCollapse={handleCoolapse}
      iconfontUrl={ICON_FONT_URL}
      menuDataRender={() => authRoute}
      menuItemRender={(menu, dom) => {
        return <Link to={menu.path}>{dom}</Link>
      }}
      actionsRender={props => {
        if (props.isMobile) return []
        return [<AvatarMenu key='AvatarMenu' />]
      }}
      layout='mix'
    >
      <SwitchTransition>
        <CSSTransition timeout={200} classNames='pages-main' key={location.pathname}>
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                colorPrimary: BASE_COLOR
              }
            }}
          >
            <div className={styles.page_container}>
              <Spin tip='加载中...' spinning={isLoading}>
                <AntdApp>
                  <AntdGlobal />
                  {currentOutlet}
                </AntdApp>
              </Spin>
            </div>
          </ConfigProvider>
        </CSSTransition>
      </SwitchTransition>
    </ProLayout>
  )
}

export default BasicLayout
