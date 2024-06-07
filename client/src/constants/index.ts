// Note: 全局常量

import LOGO from '@/assets/common/logo_black.png'

export const DEFAULT_LOGO = LOGO // 默认logo

export const DEFAULT_NAME = process.env.PLATFORM_NAME // 平台名称

export const BASE_URL = process.env.BASE_URL // 接口地址

export const BASE_COLOR = process.env.BASE_COLOR // 主题色

export const UPLOAD_URL = `${process.env.BASE_URL}/portal/v1/fileupload` // 图片/视频上传地址

export const ICON_FONT_URL = process.env.ICON_FONT_URL // 图标库地址

export const UPLOAD_URL_FILE = `${process.env.BASE_URL}/admin/v1/otabin/upload` // 文件上传地址
