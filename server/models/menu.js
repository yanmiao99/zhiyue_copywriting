const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {}
  }

  Menu.init(
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
      // 是否是父级菜单
      parentId: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0 是父级菜单 id 是子级菜单
        allowNull: false,
      },
      // 菜单路径
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 菜单图标
      icon: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // 排序
      sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // 子菜单
      children: {
        type: DataTypes.JSON,
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
      modelName: 'Menu',
    }
  );
  return Menu;
};
