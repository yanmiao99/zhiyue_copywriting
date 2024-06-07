import { Outlet } from 'umi'
import { App as AntdApp, ConfigProvider } from 'antd'
import AntdGlobal from '@/utils/AntdGlobal'
import { BASE_COLOR } from '@/constants'

// 开放页面 layout

export default props => {
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: BASE_COLOR
          }
        }}
      >
        <AntdApp>
          <AntdGlobal />
          <Outlet />
        </AntdApp>
      </ConfigProvider>
    </div>
  )
}
