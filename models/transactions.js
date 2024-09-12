"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    static associate({ Users }) {
      this.belongsTo(Users, { foreignKey: "userId", as: "user" });
    }
  }

  Transactions.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      pointsAdded: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      pointsUsed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      transactionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Transactions",
    }
  );

  return Transactions;
};
