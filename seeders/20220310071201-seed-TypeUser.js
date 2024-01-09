'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('typeusers', [
      {
        type: 'ADMIN',
        nameType: "QUẢN TRỊ VIÊN",
        isActive: true,
        createdAt: '2022-02-05 07:07:31',
        updatedAt: '2022-02-05 07:07:31'
      },
      {
        type: 'CLIENT',
        nameType: "KHÁCH HÀNG",
        isActive: true,
        createdAt: '2022-02-05 07:07:31',
        updatedAt: '2022-02-05 07:07:31'
      },
      {
        type: 'SUPPER_ADMIN',
        nameType: "SIÊU QUẢN TRỊ VIÊN",
        isActive: true,
        createdAt: '2022-02-05 07:07:31',
        updatedAt: '2022-02-05 07:07:31'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('typeusers', null, {});
  }
};
