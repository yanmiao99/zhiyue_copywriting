import { defineConfig } from '@umijs/max'
import routes from './router.js'
// const baseUrl = 'https://zhiyueapi.funjs.top'
const baseUrl = 'http://localhost:3100'

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  dva: {},
  mfsu: {},
  routes,
  alias: {
    '@': '/src',
    '@config': '/config'
  },
  favicons: ['/favicon.png'],
  manifest: { basePath: '/' },
  base: '/',
  publicPath: '/',
  proxy: {
    '/api': {
      target: baseUrl,
      changeOrigin: true
    }
  },
  npmClient: 'pnpm',
  define: {
    'process.env': {
      NODE_ENV: process.env.NODE_ENV, // 环境变量
      PLATFORM: process.env.UMI_ENV, // 平台
      BASE_URL: baseUrl, // 接口地址
      PLATFORM_NAME: '织月文案', // 平台名称
      BASE_COLOR: '#6C63FF', // 主题色
      ICON_FONT_URL: 'https://at.alicdn.com/t/c/font_4578423_s4ok749h89r.js' // 图标库
    }
  },
  outputPath: 'dist/admin',
  // 清除缓存机制
  metas: [
    {
      httpEquiv: 'Cache-Control',
      content: 'no-cache'
    },
    {
      httpEquiv: 'Pragma',
      content: 'no-cache'
    },
    {
      httpEquiv: 'Expires',
      content: '0'
    }
  ],
  hash: true // 打包文件加hash
})
