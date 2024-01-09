"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Films extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ShowTimes }) {
      // define association here
      this.hasMany(ShowTimes, { foreignKey: "idFilm", as: "film" });
    }
  }
  Films.init(
    {
      nameFilm: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      trailer: DataTypes.STRING,
      imgFilm: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      actor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      rate: DataTypes.STRING,
      comingSoon: DataTypes.BOOLEAN,
      nowShowing: DataTypes.BOOLEAN,
      showtime: DataTypes.DATE,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Films",
    }
  );
  return Films;
};
