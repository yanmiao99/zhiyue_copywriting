const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryDetails extends Model {
    static associate(models) {
      CategoryDetails.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        targetKey: 'id',
      });
    }
  }

  CategoryDetails.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 是否是主键
        autoIncrement: true, // 是否自增
        allowNull: false,
      },
      // 内容
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0 在用 1 删除
        allowNull: false,
      },
      // 是否收藏
      isCollect: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0 未收藏 1 已收藏
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CategoryDetails',
    }
  );
  return CategoryDetails;
};
