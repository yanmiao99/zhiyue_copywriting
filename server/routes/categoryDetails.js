const express = require('express');
const router = express.Router();
const { CategoryDetails, Category } = require('../models/index.js');
const log4js = require('../utils/log4j.js');
const { validateParams } = require('../utils/index.js');

// 根据分类id查询第一条详情
router.get('/first', async (req, res) => {
  const { categoryId, id } = req.query;
  try {
    // 获取当前分类下的随机一条id
    const randomIdList = await CategoryDetails.findAll({
      where: {
        categoryId,
        isDelete: 0,
      },
      order: [['id', 'ASC']],
    });

    let checkId = '';

    if (id && id !== 'null') {
      checkId = id;
    } else {
      // 随机取 randomIdList 中的一条数据的 id
      const randomIndex = Math.floor(Math.random() * randomIdList.length);
      checkId = randomIdList[randomIndex].id;
    }

    const list = await CategoryDetails.findOne({
      where: {
        categoryId,
        id: checkId,
        isDelete: 0,
      },
    });

    // 根据分类id查询分类名称
    const categoryTitle = await Category.findOne({
      where: {
        id: categoryId,
        isDelete: 0,
      },
    });

    list.dataValues.categoryTitle = categoryTitle.text;

    log4js.info('查询分类详情成功');
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

// 根据分类id添加详情
router.post(
  '/add',
  validateParams({
    text: '缺少必传参数 text (内容)',
    categoryId: '缺少必传参数 categoryId (分类)',
  }),
  async (req, res) => {
    const { categoryId, text } = req.body;

    try {
      const result = await CategoryDetails.create({
        categoryId,
        text,
      });
      log4js.info('添加分类详情成功');
      res.send({
        code: 200,
        msg: '添加成功',
        data: result,
      });
    } catch (err) {
      log4js.error(err);
      res.send({
        code: 400,
        msg: '添加失败',
        data: err,
      });
    }
  }
);

// 根据分类 id 查询数据, 分页查询, 默认查询 5 条
router.get('/list', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const categoryId = req.query.categoryId;
  try {
    const offset = (page - 1) * limit;
    const categoryDetailsList = await CategoryDetails.findAndCountAll({
      where: {
        categoryId,
        isDelete: 0,
      },
      offset,
      limit,
      order: [['id', 'DESC']],
    });
    log4js.info(`查询分类id为 ${categoryId} 的详情成功`);

    // 根据分类id查询分类名称
    const categoryTitle = await Category.findOne({
      where: {
        id: categoryId,
        isDelete: 0,
      },
    });

    categoryDetailsList.rows.forEach((list, index) => {
      list.dataValues.categoryTitle = categoryTitle.text;
      // 当前数据的索引
      list.dataValues.index = page * limit - limit + index;
    });

    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        list: categoryDetailsList.rows,
        pagination: {
          page,
          limit,
          totalCount: categoryDetailsList.count,
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
