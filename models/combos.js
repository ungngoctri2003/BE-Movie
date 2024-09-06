"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Combos extends Model {
    static associate({ Users, ShowTimes, PopcornDrinks }) {
      // Combo thuộc về một người dùng
      this.belongsTo(Users, { foreignKey: "idUser", as: "user" });
      // Combo thuộc về một suất chiếu
      this.belongsTo(ShowTimes, { foreignKey: "idShowTime", as: "showTime" });
      // Combo có thể liên kết với một PopcornDrink
      this.belongsTo(PopcornDrinks, {
        foreignKey: "popcornDrinkId",
        as: "popcornDrink",
      });
    }
  }
  Combos.init(
    {
      comboName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Combos",
    }
  );
  return Combos;
};
