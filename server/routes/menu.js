const express = require('express');
const router = express.Router();
const { Menu } = require('../models/index.js');
const log4js = require('../utils/log4j.js');
const { validateParams } = require('../utils/index.js');
const Sequelize = require('sequelize');

// 新增菜单
router.post(
  '/add',
  validateParams({
    name: '缺少必传参数 name (菜单名称)',
    path: '缺少必传参数 path (菜单路径)',
    icon: '缺少必传参数 icon (菜单图标)',
    sort: '缺少必传参数 sort (排序)',
  }),
  async (req, res) => {
    const { name, path, icon, sort } = req.body;

    // 判断名称是否存在, 如果已经存在,则不允许重名
    const menu = await Menu.findOne({
      where: {
        name,
        isDelete: 0,
      },
    });
    if (menu) {
      res.send({
        code: 400,
        msg: '菜单名称已存在',
        data: {},
      });
      return;
    }

    try {
      await Menu.create({
        name,
        path,
        icon,
        sort,
      });
      log4js.info('添加菜单成功');
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

// 删除菜单
router.post(
  '/delete',
  validateParams({
    id: '缺少必传参数 id (菜单id)',
  }),
  async (req, res) => {
    const { id } = req.body;

    try {
      await Menu.update(
        {
          isDelete: 1,
        },
        {
          where: {
            id,
          },
        }
      );

      log4js.info('删除菜单成功');
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

// 修改菜单
router.post(
  '/update',
  validateParams({
    id: '缺少必传参数 id (菜单id)',
    name: '缺少必传参数 name (菜单名称)',
    path: '缺少必传参数 path (菜单路径)',
    icon: '缺少必传参数 icon (菜单图标)',
    sort: '缺少必传参数 sort (排序)',
  }),
  async (req, res) => {
    const { id, name, path, icon, sort } = req.body;

    // 判断名称和别的菜单是否重名
    const menu = await Menu.findOne({
      where: {
        name,
        isDelete: 0,
        id: {
          [Sequelize.Op.ne]: id,
        },
      },
    });
    if (menu) {
      res.send({
        code: 400,
        msg: '菜单名称已存在',
        data: {},
      });
      return;
    }

    try {
      await Menu.update(
        {
          name,
          path,
          icon,
          sort,
        },
        {
          where: {
            id,
          },
        }
      );
      log4js.info('修改菜单成功');
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

// 查询菜单
router.get('/list', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 999;
  const name = req.query.name || '';
  try {
    const offset = (page - 1) * limit;
    const list = await Menu.findAndCountAll({
      where: {
        isDelete: 0,
        // 模糊查询
        name: {
          [Sequelize.Op.like]: `%${name}%`,
        },
      },
      offset,
      limit,
      order: [['sort', 'ASC']], // DESC 降序  ASC 升序
    });
    log4js.info('菜单查询成功');
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
