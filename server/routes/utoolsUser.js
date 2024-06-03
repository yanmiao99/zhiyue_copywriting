const express = require('express');
const router = express.Router();
const { UToolsUser } = require('../models');
const log4js = require('../utils/log4j.js');
const crypto = require('crypto'); // 使用内置的crypto库进行HMAC签名
const axios = require('axios');

// 签名方法
function generateSignature(params, secret) {
  // 1. 对请求参数按参数名升序排序
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});
  // 2. 对参数内容进行url_encode编码后，组合成URL参数形式的字符串
  const paramString = new URLSearchParams(sortedParams).toString();
  // 3. 使用HMAC方法对字符串生成带有密钥的哈希值，得到签名
  return crypto.createHmac('sha256', secret).update(paramString).digest('hex');
}

/**
 * 用户登录
 * @param access_token
 * @api {post} /api/utoolsUser/silenceLogin 用户登录
 */
router.post('/silenceLogin', async (req, res) => {
  // 1. 获取当前用户临时 access_token
  const { access_token } = req.body;

  // 2. 组成参数
  const params = {
    plugin_id: 'z3ozeytk',
    access_token,
    timestamp: Math.floor(Date.now() / 1000),
  };

  const secret = 'MBfc7ciSvoshcnGh7jloexTwh3FxgcOB';

  // 3. 签名
  const sign = generateSignature(params, secret);

  const url = 'https://open.u-tools.cn/baseinfo';

  // 发起请求
  axios
    .get(url, {
      headers: {
        Accept: 'application/json',
      },
      params: {
        ...params,
        sign,
      },
    })
    .then((response) => {
      console.log('获取到的用户信息:', response.data);
    })
    .catch((error) => {
      if (error.response) {
        // 请求已发出，但服务器响应状态码除了2xx
        console.error('发生错误，服务器响应:', error.response.data);
      } else if (error.request) {
        // 请求已发出但没有收到响应
        console.error('发生错误，请求已发送但没有收到响应:', error.request);
      } else {
        // 发生连接错误或触发了abort
        console.error('发生错误:', error.message);
      }
    });

  // 4. 获取用户基础信息接口
  // const { username, password, captcha } = req.body;
  // if (
  //   !captcha ||
  //   captcha.toLocaleLowerCase() !== captcha_text.toLocaleLowerCase()
  // ) {
  //   res.send({ code: 400, msg: "验证码不正确" });
  // } else {
  //   // 校验
  //   if (!username || !password) {
  //     log4js.error("参数错误");
  //     res.send({ code: 400, msg: "参数错误" });
  //     return;
  //   }
  //   // 查询用户是否存在
  //   const user = await User.findOne({
  //     where: {
  //       username,
  //     },
  //   });
  //   if (!user) {
  //     log4js.error(`用户 ${username} 不存在`);
  //     res.send({ code: 404, msg: "用户不存在" });
  //     return;
  //   }
  //   // 验证密码是否正确
  //   const cryptoPassword = md5(password + SALT);
  //   if (user.password !== cryptoPassword) {
  //     log4js.error(`用户 ${username} 密码不正确`);
  //     res.send({ code: 401, msg: "用户不存在或密码错误" });
  //     return;
  //   }
  //   // 生成 token 并返回给客户端
  //   const payload = { userId: user.id + 123123 };
  //   const options = { expiresIn: TOKEN_EXPIRES_IN }; // token 失效时间
  //   jwt.sign(payload, SALT, options, (err, token) => {
  //     if (err) throw err;
  //     log4js.info(`用户 ${username} 登录成功`);
  //     res.send({
  //       code: 200,
  //       msg: "登录成功",
  //       data: {
  //         token,
  //         userId: user.id,
  //         username: user.username,
  //       },
  //     });
  //   });
  // }
});

module.exports = router;
