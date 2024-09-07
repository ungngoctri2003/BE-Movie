"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("PopcornDrinks", "isActive", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Bạn có thể thay đổi giá trị mặc định nếu cần
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("PopcornDrinks", "isActive");
  },
};
