'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hashedpassword1',
        avatarUrl: '/public/assets/default2.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        passwordHash: 'hashedpassword2',
        avatarUrl: '../../public/assets/default3.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
