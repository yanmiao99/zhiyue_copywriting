const express = require('express');
const router = express.Router();
const { CategoryDetails, Category } = require('../models/index.js');
const log4js = require('../utils/log4j.js');
const { validateParams } = require('../utils/index.js');
const Sequelize = require('sequelize');

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
router.get('/detailsList', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const categoryId = req.query.categoryId || '';
  try {
    const offset = (page - 1) * limit;
    const categoryDetailsList = await CategoryDetails.findAndCountAll({
      where: {
        isDelete: 0,
        categoryId,
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

// 详情列表
router.get('/list', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const text = req.query.text || '';
  const categoryId = req.query.categoryId || '';
  try {
    const offset = (page - 1) * limit;
    const categoryDetailsList = await CategoryDetails.findAndCountAll({
      where: {
        isDelete: 0,
        text: {
          [Sequelize.Op.like]: `%${text}%`,
        },
        // 查询对应分类id的数据, 如果没有传分类id, 则查询全部
        categoryId: categoryId
          ? categoryId
          : {
              [Sequelize.Op.not]: null,
            },
      },
      offset,
      limit,
      order: [['id', 'DESC']],
    });

    log4js.info('查询分类详情成功');

    try {
      const promises = categoryDetailsList.rows.map(async (list, index) => {
        const categoryTitle = await Category.findOne({
          where: {
            id: list.categoryId,
            isDelete: 0,
          },
        });
        if (categoryTitle) {
          list.dataValues.categoryTitle = categoryTitle.dataValues.text;
        }
        return list;
      });

      const updatedList = await Promise.all(promises);

      res.send({
        code: 200,
        msg: '查询成功',
        data: {
          list: updatedList,
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
  } catch (err) {
    log4js.error(err);
    res.send({
      code: 400,
      msg: '查询失败',
      data: err,
    });
  }
});

// 删除
router.post('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await CategoryDetails.update(
      {
        isDelete: 1,
      },
      {
        where: {
          id,
        },
      }
    );
    log4js.info('删除分类详情成功');
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
});

// 更新
router.post(
  '/update',
  validateParams({
    text: '缺少必传参数 text (内容)',
    id: '缺少必传参数 id (id)',
  }),
  async (req, res) => {
    const { id, text } = req.body;
    try {
      await CategoryDetails.update(
        {
          text,
        },
        {
          where: {
            id,
          },
        }
      );
      log4js.info('更新分类详情成功');
      res.send({
        code: 200,
        msg: '更新成功',
        data: {},
      });
    } catch (err) {
      log4js.error(err);
      res.send({
        code: 400,
        msg: '更新失败',
        data: err,
      });
    }
  }
);

module.exports = router;
