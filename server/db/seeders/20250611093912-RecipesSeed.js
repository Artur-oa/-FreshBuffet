'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const recipes = [];

    for (let i = 1; i <= 10; i++) {
      recipes.push({
        title: `Рецепт ${i}`,
        description: `Описание рецепта ${i}`,
        instructions: `Шаги приготовления рецепта ${i}`,
        imageUrl: `https://example.com/recipe${i}.jpg`,
        cookTime: 10 + i * 5,
        ingredientCount: 3 + i,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    await queryInterface.bulkInsert('Recipes', recipes, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Recipes', null, {});
  }
};
