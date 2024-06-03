const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    static associate(models) {}
  }

  Setting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 是否是主键
        autoIncrement: true, // 是否自增
        allowNull: false,
      },
      // 公告
      announcement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 平台
      platform: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      // 作者
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 邮箱
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // github
      github: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 微信
      weChat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 微信公众号
      weChatPublic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 网址
      website: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 收款码
      paymentCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 是否开启收款码
      paymentCodeOpen: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isDelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0 在用 1 删除
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Setting',
    }
  );
  return Setting;
};
