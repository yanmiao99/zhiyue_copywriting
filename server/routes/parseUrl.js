const express = require('express');
const router = express.Router();
const { ParseUrl } = require('../models/index.js');
const log4js = require('../utils/log4j.js');
const { Op } = require('sequelize');
const axios = require('axios');

// 添加解析URL
router.get('/query', async (req, res) => {
  const { url, userIp, platform } = req.query;
  const result = await axios.get(`https://yy.yyymvp.com/query?url=${url}`);

  let tempData = {};
  if (result.data.code === 100) {
    const resData = result.data.data;
    const pattern = /\.mp4$/i;
    if (resData.type === 1 && !pattern.test(resData.downurl)) {
      tempData = {
        url,
        ...resData,
        downurl: `${resData.downurl}.mp4`,
        pics: Array.isArray(tempData.pics) ? tempData.pics : [],
      };
    } else {
      tempData = {
        url,
        ...resData,
      };
    }

    // 判断一下当前的链接是否有 zuiyou 或者 最右 , 如果有则去除 .mp4 后缀
    if (tempData.downurl) {
      if (
        tempData.downurl.includes('zuiyou') ||
        tempData.downurl.includes('最右')
      ) {
        tempData.downurl = tempData.downurl.replace('.mp4', '');
      }
    }

    try {
      await ParseUrl.create({
        url,
        photo: tempData.photo,
        title: tempData.title,
        pics: tempData.pics,
        downurl: tempData.downurl,
        type: tempData.type,
        userIp,
        platform,
      });

      log4js.info('解析URL成功');
      res.send({
        code: 200,
        msg: '解析成功',
        data: {
          ...tempData,
        },
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
    log4js.error(result.data.message);
    res.send({
      code: 400,
      msg: result.data.message,
      data: {},
    });
  }
});

// 查询 URL 列表
router.get('/list', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { title } = req.query;

  let searchWhere = {};
  if (title) {
    searchWhere = {
      title: {
        // 模糊搜索
        [Op.like]: `%${title}%`,
      },
    };
  }

  try {
    const offset = (page - 1) * limit;
    const list = await ParseUrl.findAll({
      // 查询条件需要查询isDelete为0的数据
      where: {
        isDelete: 0,
        ...searchWhere,
      },
      attributes: {
        // 设置排除的字段
        exclude: ['isDelete'],
      },
      offset,
      limit,
      order: [['id', 'DESC']], // 倒序返回数据
    });
    const totalCount = await ParseUrl.count({
      where: {
        isDelete: 0,
        ...searchWhere,
      },
    });

    log4js.info('查询成功');
    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        list: list,
        pagination: {
          page, // 当前页数，即请求中传入的page参数。
          limit, // 每页返回的数据量，即请求中传入的limit参数。
          totalCount, // 满足查询条件的总数据量，也就是不考虑分页时查询结果的总数。
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

// 查询当前 URL 列表的 日/月/年/总 访问量
router.get('/count', async (req, res) => {
  let dateMap = {
    dayCount: {
      count: 0,
      date: new Date(new Date().toLocaleDateString()),
    },
    monthCount: {
      count: 0,
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
    yearCount: {
      count: 0,
      date: new Date(new Date().getFullYear(), 0, 1),
    },
    totalCount: {
      count: 0,
    },
  };

  try {
    // 查询用户使用总数
    for (let key in dateMap) {
      let where = {};

      if (dateMap[key].date) {
        where = {
          isDelete: 0,
          createdAt: {
            [Op.gte]: dateMap[key].date,
          },
        };
      } else {
        where = {
          isDelete: 0,
        };
      }

      dateMap[key].count = await ParseUrl.count({
        where,
      });
    }

    // 查询用户ip总数 , 规则 , 查询到所有的用户ip , 然后去重
    const ipList = await ParseUrl.findAll({
      where: {
        userIp: {
          [Op.ne]: null,
        },
      },
      attributes: {
        // 设置排除的字段
        exclude: [
          'id',
          'url',
          'photo',
          'title',
          'downurl',
          'type',
          'pics',
          'isDelete',
          'createdAt',
          'updatedAt',
        ],
      },
    });

    let ipListArr = [];
    ipList.forEach((item) => {
      ipListArr.push(item.userIp);
    });

    // ipListArr 去重
    const ipListArrSet = [...new Set(ipListArr)];

    // 查询当天每个小时的访问量
    const date = new Date();
    const hour = date.getHours();
    let hourCount = [];
    for (let i = 0; i <= hour; i++) {
      const start = new Date(new Date().toLocaleDateString());
      start.setHours(i);
      const end = new Date(new Date().toLocaleDateString());
      end.setHours(i + 1);

      const count = await ParseUrl.count({
        where: {
          isDelete: 0,
          createdAt: {
            [Op.gte]: start,
            [Op.lt]: end,
          },
        },
      });

      i < 10 ? (i = '0' + i) : i;

      hourCount.push({
        hour: i + ':00',
        count,
      });
    }

    log4js.info('查询成功');
    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        dayCount: dateMap.dayCount.count,
        monthCount: dateMap.monthCount.count,
        yearCount: dateMap.yearCount.count,
        totalCount: dateMap.totalCount.count,
        userIpCount: ipListArrSet.length,
        hourCount,
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
