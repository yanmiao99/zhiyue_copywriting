const express = require('express');
const router = express.Router();
const { UpdateLog } = require('../models/index.js');
const log4js = require('../utils/log4j.js');
const { validateParams } = require('../utils/index.js');

// 更新日志
router.post(
  '/update',
  validateParams({
    noteContent: '缺少内容参数',
  }),
  async (req, res) => {
    const { noteContent } = req.body;

    const params = { noteContent };

    // 查询是否存在, 如果存在则修改, 不存在则创建
    const isExistence = await UpdateLog.findOne({
      where: {
        id: 1,
      },
    });

    if (isExistence) {
      try {
        await UpdateLog.update(params, {
          where: {
            id: 1,
          },
        });

        log4js.info('修改更新日志成功');
        res.send({
          code: 200,
          msg: '修改成功',
          data: {},
        });
      } catch (err) {
        log4js.error(err);
        res.send({
          code: 400,
          msg: '网络错误,请重试 ~ ',
          data: err,
        });
      }
    } else {
      try {
        await UpdateLog.create(params);
        log4js.info('创建更新日志成功');
        res.send({
          code: 200,
          msg: '添加成功',
          data: {},
        });
      } catch (err) {
        log4js.error(err);
        res.send({
          code: 400,
          msg: '网络错误,请重试 ~ ',
          data: err,
        });
      }
    }
  }
);

// 查询
router.get('/info', async (req, res) => {
  try {
    const oneUpdateLog = await UpdateLog.findOne({
      where: {
        isDelete: 0,
        id: 1,
      },
      attributes: {
        // 设置排除的字段
        exclude: ['isDelete'],
      },
    });
    log4js.info('更新日志查询成功');
    res.send({
      code: 200,
      msg: '查询成功',
      data: oneUpdateLog,
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

module.exports = router;
