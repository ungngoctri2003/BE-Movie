"use strict";

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
    await queryInterface.bulkInsert(
      "users",
      [
        {
          userName: "ADMIN",
          password:
            "$2a$10$/4qjFZdFjWavMIoEyrEMPeVjgQQqg/VTKEI7Ciz.7FMDU3ctMgxjm" /*123456*/,
          email: "lamcongtri2003@gmail.com",
          phoneNumber: "0869956733",
          avatar: "",
          isBlock: 0,
          isActive: 1,
          typeUser: 3,
          createdAt: "2024-01-05 07:07:31",
          updatedAt: "2024-01-05 07:07:31",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
