"use strict";
module.exports = (sequelize, DataTypes) => {
  const PopcornDrinks = sequelize.define(
    "PopcornDrinks",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );

  // Định nghĩa các mối quan hệ (associations)
  PopcornDrinks.associate = function (models) {
    PopcornDrinks.belongsTo(models.Users, { foreignKey: "userId", as: "user" });
    // Có thể định nghĩa thêm mối quan hệ khác nếu cần
  };

  return PopcornDrinks;
};
