"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Recipes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      instructions: {
        type: Sequelize.TEXT,
      },
      imageUrl: {
        type: Sequelize.STRING(1000),
      },
      cookTime: {
        type: Sequelize.INTEGER,
      },
      ingredientCount: {
        type: Sequelize.INTEGER,
      },
      apiId: {
        type: Sequelize.INTEGER,
        unique: true, // чтобы не было дубликатов
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
    await queryInterface.dropTable("Recipes");
  },
};
