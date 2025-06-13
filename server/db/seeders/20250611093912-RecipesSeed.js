'use strict';

const axios = require('axios');
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // const recipes = [];

    // for (let i = 1; i <= 10; i++) {
    //   recipes.push({
    //     title: `Рецепт ${i}`,
    //     description: `Описание рецепта ${i}`,
    //     instructions: `Шаги приготовления рецепта ${i}`,
    //     imageUrl: `https://example.com/recipe${i}.jpg`,
    //     cookTime: 10 + i * 5,
    //     ingredientCount: 3 + i,
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   });
    // }
    
    // await queryInterface.bulkInsert('Recipes', recipes, {});

    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/random', {
        params: {
          number: 9,
          apiKey: SPOONACULAR_API_KEY,
        },
      });

      const recipesRaw = response.data.recipes;

      const recipes = recipesRaw.map(recipe => ({
        title: recipe.title?.slice(0, 255) || 'Без названия',
        description: recipe.summary?.slice(0, 1000) || 'Описание недоступно',
        instructions: recipe.instructions?.slice(0, 3000) || '',
        imageUrl: recipe.image || 'https://via.placeholder.com/300',
        cookTime: recipe.readyInMinutes || 30,
        ingredientCount: recipe.extendedIngredients?.length || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert('Recipes', recipes, {});
    } catch (error) {
      console.error('Ошибка при загрузке рецептов из Spoonacular API:', error.message);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Recipes', null, {});
  }
};
