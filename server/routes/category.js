const express = require('express');
const router = express.Router();
const { Category, CategoryDetails } = require('../models/index.js');
const log4js = require('../utils/log4j.js');
const { validateParams } = require('../utils/index.js');
const Sequelize = require('sequelize');

// 添加分类
router.post(
  '/add',
  validateParams({
    text: '缺少必传参数 text (内容)',
    icon: '缺少必传参数 icon (图标)',
  }),
  async (req, res) => {
    const { text, icon } = req.body;

    // 判断名称是否存在, 如果已经存在,则不允许重名
    const category = await Category.findOne({
      where: {
        text,
        isDelete: 0,
      },
    });
    if (category) {
      res.send({
        code: 400,
        msg: '分类名称已存在',
        data: {},
      });
      return;
    }

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

      // 删除分类下的所有分类详情
      await CategoryDetails.update(
        {
          isDelete: 1,
        },
        {
          where: {
            categoryId: id,
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

    // 判断分类是否存在,并且不准重名, 除了自己
    const category = await Category.findOne({
      where: {
        text,
        isDelete: 0,
        id: {
          [Sequelize.Op.ne]: id,
        },
      },
    });
    if (category) {
      res.send({
        code: 400,
        msg: '分类名称已存在',
        data: {},
      });
      return;
    }

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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 999;
  const text = req.query.text || '';
  try {
    const offset = (page - 1) * limit;
    const list = await Category.findAndCountAll({
      where: {
        isDelete: 0,
        // 模糊查询
        text: {
          [Sequelize.Op.like]: `%${text}%`,
        },
      },
      offset,
      limit,
      order: [['id', 'DESC']],
    });
    log4js.info('分类查询成功');
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

module.exports = router;
