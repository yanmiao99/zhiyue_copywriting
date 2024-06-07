import { Outlet } from 'umi'
import styles from './index.less'
import { App as AntdApp, ConfigProvider } from 'antd'
import AntdGlobal from '@/utils/AntdGlobal'
import { BASE_COLOR } from '@/constants'

export default props => {
  return (
    <div className={styles.door_wrapper}>
      <div className={styles.inner_wrapper}>
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
    </div>
  )
}
