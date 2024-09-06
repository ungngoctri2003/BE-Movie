"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo bảng Combos nếu nó không tồn tại
    await queryInterface.createTable("Combos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      comboName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      popcornDrinkId: {
        type: Sequelize.INTEGER,
        references: {
          model: "PopcornDrinks",
          key: "id",
        },
        allowNull: true,
        onDelete: "SET NULL",
      },
      idUser: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      idShowTime: {
        type: Sequelize.INTEGER,
        references: {
          model: "ShowTimes",
          key: "id",
        },
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Combos");
  },
};
