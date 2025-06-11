'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const favorites = [];

    // Для пользователя 1 (Alice) — рецепты 1–5
    for (let recipeId = 1; recipeId <= 5; recipeId++) {
      favorites.push({
        userId: 1,
        recipeId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Для пользователя 2 (Bob) — рецепты 6–10
    for (let recipeId = 6; recipeId <= 10; recipeId++) {
      favorites.push({
        userId: 2,
        recipeId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Favorites', favorites, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Favorites', null, {});
  }
};
