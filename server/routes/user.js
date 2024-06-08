const express = require('express');
const router = express.Router();
const { User } = require('../models');
const log4js = require('../utils/log4j.js');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const { SALT } = require('../config/index.js');
const passport = require('passport');
const { TOKEN_EXPIRES_IN } = require('../config/index.js');
const sendEmail = require('../utils/sendEmail.js'); //发送邮件
const Sequelize = require('sequelize');

let codeMap = {}; // 临时存储验证码

/**
 * 用户注册
 * @param username
 * @param password
 * @api {post} /api/user/register 用户注册
 */

router.post('/register', async (req, res) => {
  const { email, username, password, platform, code, type } = req.body;

  // 校验
  if (!username || !password || !platform || !email) {
    log4js.error('缺少参数');
    res.send({ code: 400, msg: '缺少参数' });
    return;
  }

  // 如果是后台注册，不需要验证码
  if (type !== 'server') {
    // 判断验证码是否存在
    if (!code) {
      res.send({ code: 400, msg: '请输入验证码' });
      return;
    }

    // 判断验证码是否正确
    if (Number(code) !== Number(codeMap[email])) {
      res.send({ code: 400, msg: '验证码不正确' });
      return;
    }

    // 删除验证码
    delete codeMap[email];
  }

  // 判断邮箱格式
  if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
    log4js.error('邮箱格式不正确');
    res.send({ code: 400, msg: '邮箱格式不正确' });
    return;
  }

  if (username.length > 32) {
    log4js.error('用户名过长');
    res.send({ code: 400, msg: '用户名过长' });
    return;
  }

  // 判断平台是否存在
  if (!['server', 'applet', 'all'].includes(platform)) {
    log4js.error('平台不存在');
    res.send({ code: 400, msg: '平台不存在' });
    return;
  }

  // 判断邮箱是否已存在
  const isEmailExists = await User.findOne({
    where: {
      email,
      isDelete: 0,
    },
  });

  if (isEmailExists) {
    log4js.error('该邮箱已被注册');
    res.send({ code: 400, msg: '该邮箱已被注册' });
    return;
  }

  // 创建一个新的用户
  try {
    const cryptoPassword = md5(password + SALT);
    await User.create({
      email,
      platform,
      username,
      password: cryptoPassword,
    });
    log4js.info('注册成功');
    res.send({
      code: 200,
      msg: '注册成功',
      data: {
        username,
      },
    });
  } catch (err) {
    log4js.error(err);
    res.send({
      code: 400,
      msg: '添加失败',
      data: err,
    });
  }
});

// 生成六位随机验证码
function createCode() {
  return parseInt(Math.random() * 1000000);
}

// 生成验证码邮件
router.get('/getCode', async (req, res) => {
  const email = req.query.email;
  try {
    // 生成验证码
    const code = createCode();
    codeMap[email] = code;
    // 发送邮件
    sendEmail(email, code);
    res.send({
      code: 200,
      msg: '获取验证码成功',
      data: {
        captcha: code,
      },
    });
  } catch (err) {
    log4js.error(err);
    res.send({
      code: 400,
      msg: '获取验证码失败',
      data: err,
    });
  }
});

/**
 * 用户登录
 * @param email
 * @param password
 * @api {post} /api/user/login 用户登录
 */
router.post('/login', async (req, res) => {
  const { email, password, platform } = req.body;

  // 校验
  if (!email || !password) {
    log4js.error('参数错误');
    res.send({ code: 400, msg: '参数错误' });
    return;
  }

  // 查询用户是否存在
  const emailExists = await User.findOne({
    where: {
      email,
      isDelete: 0,
    },
  });

  if (!emailExists) {
    log4js.error(`邮箱 ${email} 不存在`);
    res.send({ code: 400, msg: '邮箱不存在' });
    return;
  }

  // 验证密码是否正确
  const cryptoPassword = md5(password + SALT);
  if (emailExists.password !== cryptoPassword) {
    log4js.error(` ${email} 密码不正确`);
    res.send({ code: 400, msg: '邮箱不存在或密码错误' });
    return;
  }

  console.log('emailExists.platform========', emailExists.platform);

  // 判断平台
  if (emailExists.platform !== 'all' && emailExists.platform !== platform) {
    log4js.error(` ${email} 无权限登录`);
    res.send({ code: 401, msg: '无权限登录' });
    return;
  }

  // 生成 token 并返回给客户端
  const payload = { userId: emailExists.id + 123123 };
  const options = { expiresIn: TOKEN_EXPIRES_IN }; // token 失效时间
  jwt.sign(payload, SALT, options, (err, token) => {
    if (err) throw err;
    log4js.info(`邮箱 ${email} 登录成功`);
    res.send({
      code: 200,
      msg: '登录成功',
      data: {
        token,
        userId: emailExists.id,
        username: emailExists.username,
      },
    });
  });
});

/**
 * 获取当前用户信息
 * @api {get} /api/user/current 获取当前用户信息
 * @apiHeader {String} Authorization Bearer token
 * @api {get} /api/user/current 获取当前用户信息
 */
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // 根据用户id 去数据库中查询用户信息

    const userId = req.user.id;

    try {
      const data = await User.findOne({
        where: {
          id: userId,
          isDelete: 0,
        },
        // 排除密码
        attributes: {
          exclude: ['password'],
        },
      });

      res.send({
        code: 200,
        msg: '用户信息获取成功',
        data,
      });
    } catch (err) {
      log4js.error('用户信息获取失败');
      res.send({
        code: 400,
        msg: '用户信息获取失败',
        data: err,
      });
    }
  }
);

/**
 * 修改密码
 * @param username
 * @param password
 * @api {post} /api/user/updatePassword 修改密码
 * @apiHeader {String} Authorization Bearer token
 * @api {post} /api/user/updatePassword 修改密码
 * @apiParam {String} newPassword 新密码
 * @apiParam {String} confirmPassword 确认密码
 *
 *
 */
router.post(
  '/updatePassword',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { username, password, checkPassword } = req.body;

    if (password !== checkPassword) {
      res.send({ code: 400, msg: '两次密码不一致' });
    } else {
      try {
        const cryptoPassword = md5(password + SALT);
        await User.update(
          {
            password: cryptoPassword,
          },
          {
            where: {
              id: req.user.id,
              username,
            },
          }
        );
        log4js.info('修改密码成功');
        res.send({
          code: 200,
          msg: '修改密码成功',
        });
      } catch (err) {
        log4js.error(err);
        res.send({
          code: 400,
          msg: '修改密码失败',
          data: err,
        });
      }
    }
  }
);

// 更新个人资料
router.post(
  '/updateUserInfo',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { username, avatar, platform, id } = req.body;

    const updateData = {};

    if (platform) {
      updateData.platform = platform;
    }

    try {
      await User.update(
        {
          username,
          avatar,
          ...updateData,
        },
        {
          where: {
            id: id ? id : req.user.id,
          },
        }
      );
      log4js.info('修改个人资料成功');
      res.send({
        code: 200,
        msg: '修改个人资料成功',
      });
    } catch (err) {
      log4js.error(err);
      res.send({
        code: 400,
        msg: '修改个人资料失败',
        data: err,
      });
    }
  }
);

// 获取用户列表
router.get('/list', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const username = req.query.username || '';
  const email = req.query.email || '';
  const platform = req.query.platform || '';

  try {
    const offset = (page - 1) * limit;

    const list = await User.findAndCountAll({
      where: {
        isDelete: 0,
        // 多条件查询
        [Sequelize.Op.and]: [
          {
            username: {
              [Sequelize.Op.like]: `%${username}%`,
            },
          },
          {
            email: {
              [Sequelize.Op.like]: `%${email}%`,
            },
          },
          {
            platform: {
              [Sequelize.Op.like]: `%${platform}%`,
            },
          },
        ],
      },
      offset,
      limit,
      order: [['id', 'DESC']],
      // 排除密码
      attributes: {
        exclude: ['password'],
      },
    });
    log4js.info('用户查询成功');
    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        list: list.rows,
        pagination: {
          page,
          limit,
          totalCount: list.count,
        },
      },
    });
  } catch (err) {
    log4js.error(err);
    res.send({
      code: 400,
      msg: '查询失败',
      data: err,
    });
  }
});

// 删除用户
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await User.update(
      {
        isDelete: 1,
      },
      {
        where: {
          id,
        },
      }
    );
    log4js.info('删除用户成功');
    res.send({
      code: 200,
      msg: '删除成功',
    });
  } catch (err) {
    log4js.error(err);
    res.send({
      code: 400,
      msg: '删除失败',
      data: err,
    });
  }
});

module.exports = router;
