const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UToolsUser extends Model {
    // 定义类方法 (一对多关系)
    static associate(models) {}
  }

  UToolsUser.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 是否是主键
        autoIncrement: true, // 是否自增
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      open_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      member: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 是否是会员 , 0(否)  1(是)
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0 可用 1 注销
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UToolsUser',
    }
  );
  return UToolsUser;
};
