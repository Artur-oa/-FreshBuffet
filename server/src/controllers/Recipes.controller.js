const RecipesService = require("../services/Recipes.service");
const formatResponse = require("../utils/formatResponse");
const { Favorite } = require("../../db/models");

class RecipesController {
  // Получение всех рецептов с пагинацией
  static async getAllRecipes(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 9;
      const offset = (page - 1) * limit;

      const recipes = await RecipesService.getPaginated({ limit, offset });

      res.status(200).json(
        formatResponse({
          statusCode: 200,
          message: "Все рецепты",
          data: recipes,
        }),
      );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Внутренняя ошибка сервера",
          error: message,
        }),
      );
    }
  }

  // Получение рецепта по ID
  static async getRecipeById(req, res) {
    try {
      const { id } = req.params;
      const recipe = await RecipesService.getById(id);

      if (!recipe) {
        return res.status(404).json(
          formatResponse({
            statusCode: 404,
            message: "Рецепт не найден",
            error: "Рецепт не найден",
          }),
        );
      }

      res.status(200).json(
        formatResponse({
          statusCode: 200,
          message: "Рецепт получен",
          data: recipe,
        }),
      );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Внутренняя ошибка сервера",
          error: message,
        }),
      );
    }
  }

  // Загрузка рецептов из внешнего API
  static async loadFromApi(req, res) {
    try {
      const savedRecipes = await RecipesService.saveFromSpoonacular(10);

      res.status(201).json(
        formatResponse({
          statusCode: 201,
          message: "Загружено из API",
          data: savedRecipes,
        }),
      );
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Ошибка загрузки из Spoonacular",
          error: message,
        }),
      );
    }
  }

  static async getRandomRecipes(req, res) {
    try {
      const randomRecipes = await RecipesService.getRandom(10);

      res.status(200).json(
        formatResponse({
          statusCode: 200,
          message: "Загружено из API",
          data: randomRecipes,
        }),
      );
    } catch ({ message }) {
      console.error(error.message); // <-- Было пусто
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Ошибка при получении случайных рецептов",
          error: error.message,
        }),
      );
    }
  }
}

module.exports = RecipesController;
