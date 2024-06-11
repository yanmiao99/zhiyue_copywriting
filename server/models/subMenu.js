const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubMenu extends Model {
    static associate(models) {
      SubMenu.belongsTo(models.Category, {
        foreignKey: 'parentId',
        targetKey: 'id',
      });
    }
  }

  SubMenu.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 是否是主键
        autoIncrement: true, // 是否自增
        allowNull: false,
      },
      // 菜单名称
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 菜单路径
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 排序
      sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // 是否删除
      isDelete: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0 在用 1 删除
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SubMenu',
    }
  );
  return SubMenu;
};
