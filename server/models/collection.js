const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Collection extends Model {
    static associate(models) {
      // 所属分类详情
      Collection.belongsTo(models.CategoryDetails, {
        foreignKey: 'categoryDetailsId', // 关联的外键
        targetKey: 'id', // 关联的目标字段
      });
      // 所属用户
      Collection.belongsTo(models.User, {
        foreignKey: 'userId', // 关联的外键
        targetKey: 'id', // 关联的目标字段
      });
    }
  }

  Collection.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 是否是主键
        autoIncrement: true, // 是否自增
        allowNull: false,
      },
      // 是否删除
      isDelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0 在用 1 删除
        allowNull: false,
      },
      // 所属分类详情
      categoryDetailsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // 所属用户
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Collection',
    }
  );
  return Collection;
};
