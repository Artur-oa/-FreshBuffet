'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hashedpassword1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        passwordHash: 'hashedpassword2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
