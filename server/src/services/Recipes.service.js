const { Recipe } = require("../../db/models");
const axios = require("axios");

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

class RecipesService {
  // Получаем всех пользователей из БД
  static async getAll() {
    return await Recipe.findAll();
  }

  // Метод для получения одного рецепта по первичному ключу id
  static async getById(id) {
    return await Recipe.findByPk(id);
  }

  static async getPaginated({ limit, offset }) {
    // Выполняем запрос к базе данных с ограничением количества записей (limit)
    // и смещением (offset) — это позволяет загружать рецепты "порциями"
    const recipes = await Recipe.findAll({
      limit, // Количество рецептов, которое нужно получить
      offset, // Количество рецептов, которое нужно пропустить (для следующей страницы)
    });

    return recipes;
  }

  static async saveFromSpoonacular(number = 10) {
    const response = await axios.get("https://api.spoonacular.com/recipes/random", {
      params: {
        number,
        apiKey: SPOONACULAR_API_KEY,
      },
    });

    const recipes = response.data.recipes;

    // Сохраняем каждое блюдо в базу
    const savedRecipes = await Promise.all(
      recipes.map(recipe =>
        Recipe.create({
          title: recipe.title?.slice(0, 255) || "Без названия",
          description: recipe.summary?.slice(0, 1000) || "Без описания",
          instructions: recipe.instructions?.slice(0, 3000) || "",
          imageUrl: recipe.image,
          cookTime: recipe.readyInMinutes,
          ingredientCount: recipe.extendedIngredients?.length || 0,
        }),
      ),
    );

    return savedRecipes;
  }
}

module.exports = RecipesService;
