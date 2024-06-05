const express = require('express');
const router = express.Router();
const { Category } = require('../models/index.js');
const log4js = require('../utils/log4j.js');
const { validateParams } = require('../utils/index.js');

// 添加分类
router.post(
  '/add',
  validateParams({
    text: '缺少必传参数 text (内容)',
    icon: '缺少必传参数 icon (图标)',
  }),
  async (req, res) => {
    const { text, icon } = req.body;
    try {
      await Category.create({
        text,
        icon,
      });
      log4js.info('添加分类成功');
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
);

// 删除分类
router.post(
  '/delete',
  validateParams({
    id: '缺少必传参数 id (分类id)',
  }),
  async (req, res) => {
    const { id } = req.body;
    try {
      await Category.update(
        {
          isDelete: 1,
        },
        {
          where: {
            id,
          },
        }
      );
      log4js.info('删除分类成功');
      res.send({
        code: 200,
        msg: '删除成功',
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
);

// 修改分类
router.post(
  '/update',
  validateParams({
    id: '缺少必传参数 id (分类id)',
    text: '缺少必传参数 text (内容)',
    icon: '缺少必传参数 icon (图标)',
  }),
  async (req, res) => {
    const { id, text, icon } = req.body;
    try {
      await Category.update(
        {
          text,
          icon,
        },
        {
          where: {
            id,
          },
        }
      );
      log4js.info('修改分类成功');
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
  }
);

// 查询分类
router.get('/list', async (req, res) => {
  try {
    const list = await Category.findAll({
      where: {
        isDelete: 0,
      },
      attributes: {
        // 设置排除的字段
        exclude: ['isDelete'],
      },
    });
    log4js.info('分类查询成功');
    res.send({
      code: 200,
      msg: '查询成功',
      data: list,
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