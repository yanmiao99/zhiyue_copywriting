const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {}
  }

  Category.init(
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
      // 图标
      icon: {
        type: DataTypes.STRING,
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
      modelName: 'Category',
    }
  );
  return Category;
};
