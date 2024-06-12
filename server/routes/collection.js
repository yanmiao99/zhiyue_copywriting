const express = require('express');
const router = express.Router();
const { CategoryDetails, Collection } = require('../models/index.js');
const log4js = require('../utils/log4j.js');
const { validateParams } = require('../utils/index.js');
const Sequelize = require('sequelize');

// 新增收藏
router.post(
  '/add',
  validateParams({
    categoryDetailsId: '缺少必传参数 categoryDetailsId (分类详情id)',
  }),
  async (req, res) => {
    const { categoryDetailsId } = req.body;
    try {
      // 判断是否已经收藏了,
      const collection = await Collection.findOne({
        where: {
          categoryDetailsId: categoryDetailsId,
          userId: req.user.id,
          isDelete: 0,
        },
      });
      if (collection) {
        log4js.info('已经收藏过了');
        res.send({
          code: 400,
          msg: '已经收藏过了',
          data: {},
        });
        return;
      }

      await Collection.create({
        categoryDetailsId: categoryDetailsId,
        userId: req.user.id,
      });

      // 更新分类详情表的收藏
      await CategoryDetails.update(
        {
          isCollect: 1,
        },
        {
          where: {
            id: categoryDetailsId,
            isDelete: 0,
          },
        }
      );

      log4js.info('新增收藏成功');
      res.send({
        code: 200,
        msg: '新增成功',
        data: {},
      });
    } catch (err) {
      log4js.error(err);
      res.send({
        code: 400,
        msg: '新增失败',
        data: err,
      });
    }
  }
);

// 删除收藏
router.post(
  '/delete',
  validateParams({
    categoryDetailsId: '缺少必传参数 categoryDetailsId (分类详情id)',
  }),
  async (req, res) => {
    const { categoryDetailsId } = req.body;
    try {
      // 判断是否已经收藏了,
      const collection = await Collection.findOne({
        where: {
          categoryDetailsId: categoryDetailsId,
          userId: req.user.id,
          isDelete: 0,
        },
      });
      if (!collection) {
        log4js.info('没有收藏过');
        res.send({
          code: 400,
          msg: '没有收藏过',
          data: {},
        });
        return;
      }

      // 更新收藏表
      await Collection.update(
        {
          isDelete: 1,
        },
        {
          where: {
            categoryDetailsId: categoryDetailsId,
            userId: req.user.id,
          },
        }
      );

      // 更新分类详情表的收藏
      await CategoryDetails.update(
        {
          isCollect: 0,
        },
        {
          where: {
            id: categoryDetailsId,
            isDelete: 0,
          },
        }
      );

      log4js.info('删除收藏成功');
      res.send({
        code: 200,
        msg: '删除成功',
        data: {},
      });
    } catch (err) {
      log4js.error(err);
      res.send({
        code: 400,
        msg: '删除失败',
        data: err,
      });
    }
  }
);

// 查询收藏列表
router.get('/list', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const offset = (page - 1) * limit;
    const list = await Collection.findAndCountAll({
      where: {
        userId: req.user.id,
        isDelete: 0,
      },
      offset,
      limit,
      order: [['id', 'DESC']],
      // 关联查询 , 根据 categoryDetailsId 关联查询分类详情表 , 获取到 text
      include: [
        {
          model: CategoryDetails,
          attributes: ['text'],
          where: {
            isDelete: 0,
          },
        },
      ],
    });
    log4js.info('收藏查询成功');
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
