'use strict';

const { Recipe } = require('../../db/models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // получаем реально существующие рецепты
    const recipes = await Recipe.findAll({ limit: 3 });

    const favorites = recipes.map((recipe, index) => ({
      userId: 1, // допустим, у тебя есть сид юзера с id=1
      recipeId: recipe.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Favorites', favorites, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Favorites', null, {});
  }
};
