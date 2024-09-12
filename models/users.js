"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ TypeUser, Tickets, Transactions }) {
      // define association here
      this.belongsTo(TypeUser, { foreignKey: "typeUser", as: "type_user" });
      this.hasMany(Tickets, { foreignKey: "userId", as: "user" });
      this.hasMany(Transactions, { foreignKey: "userId", as: "transactions" });
    }
  }
  Users.init(
    {
      userName: {
        type: DataTypes.STRING,
        allowNull: "false",
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: "false",
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: "false",
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: "false",
        validate: {
          notEmpty: true,
        },
      },
      avatar: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      isVerify: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      linkVerify: {
        type: DataTypes.STRING,
      },
      isBlock: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      isActive: DataTypes.BOOLEAN,
      // Thêm trường points
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Giá trị mặc định là 0
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
