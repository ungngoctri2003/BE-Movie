"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Rooms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roomName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      idCinema: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cinemas",
          key: "id",
        },
      },
      maxSeat: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      size: { type: Sequelize.STRING, allowNull: true },
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
    await queryInterface.dropTable("Rooms");
  },
};
