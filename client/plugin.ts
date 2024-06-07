// @ts-ignore
import { IApi } from 'max';
const isDev = process.env.NODE_ENV === 'development'

export default (api: IApi) => {
  api.modifyHTML(($: any) => {
    return $;
  });
  // api.addHTMLLinks(() => [
  //   {
  //     rel: 'shortcut icon',
  //     href: process.env.NODE_ENV === 'development' ? '/favicon.ico' : null,
  //     type: 'image/x-icon',
  //   },
  // ]);
  api.addHTMLHeadScripts(() => [
    {
      // src: isDev ? '/iconfont.js' : './iconfont.js'
      src: '/iconfont.js'
    }
  ])
};
