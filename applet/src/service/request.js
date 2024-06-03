import Taro from '@tarojs/taro';
const BASE_URL = process.env.TARO_APP_BASE_URL;

const request = (params) => {
  const { url, data, method, headers } = params;

  const header = {
    'content-type': 'application/json',
    ...headers,
  };

  return new Promise((resolve, reject) => {
    Taro.request({
      url: BASE_URL + url,
      data,
      method,
      header,
      timeout: 50000,
      success: (res) => {
        const { code } = res.data;
        if (code === 200) {
          resolve(res.data);
        } else {
          Taro.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export default request;
