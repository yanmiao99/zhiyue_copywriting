const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UpdateLog extends Model {
    static associate(models) {}
  }

  UpdateLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 是否是主键
        autoIncrement: true, // 是否自增
        allowNull: false,
      },
      noteContent: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isDelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0 未删除 1 已删除
      },
    },
    {
      sequelize,
      modelName: 'UpdateLog',
    }
  );
  return UpdateLog;
};
