const RecipesService = require("../services/Recipes.service");
const formatResponse = require("../utils/formatResponse");
const { Favorite } = require("../../db/models")

class RecipesController {
  // Метод для получения всех пользователей из API
  static async getAllRecipes(req, res) {
    try {
      // Получаем query-параметры из URL, например: /recipes?page=2&limit=9
      // Если параметр не указан — используем значение по умолчанию

      // Шаг 1. Преобразуем строку в число (например, "2" → 2)
      const page = parseInt(req.query.page) || 1;

      // Шаг 2. Преобразуем параметр `limit` — сколько рецептов загружать за раз
      const limit = parseInt(req.query.limit) || 9;

      // Шаг 3. Вычисляем смещение (offset) — с какой позиции начать выборку из базы
      // Например: page = 3, limit = 9 → offset = (3 - 1) * 9 = 18
      // Это значит: пропустить первые 18 рецептов и начать с 19-го
      const offset = (page - 1) * limit;

      // Шаг 4. Получаем пользователей из заданного диапозона
      const recipes = await RecipesService.getPaginated({ limit, offset });

      res.status(200).json(formatResponse(200, "Все рецепты", recipes));

      // Пулучаем всех пользователей
      /* const allRecipes = await RecipesService.getAll();

      res.status(200).json(formatResponse(200, "Все рецепты", allRecipes)); */
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }
  // Метод получения одного рецепта по id
  static async getRecipeById(req, res) {
    try {
      const { id } = req.params;
      const recipe = await RecipesService.getById(id);
      if (!recipe) {
        return res
          .status(404)
          .json(formatResponse(404, "Рецепт не найден", null, "Рецепт не найден"));
      }
      res.status(200).json(formatResponse(200, "Рецепт получен", recipe));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }


  // Метод для загрузки данных из API в БД
  static async loadFromApi(req, res) {
    try {
      const savedRecipes = await RecipesService.saveFromSpoonacular(10);

      res.status(201).json(formatResponse(201, "Загружено из API", savedRecipes));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, "Ошибка загрузки из Spoonacular", null, message));
    }
  }

 // Метод добавления рецепта в избранное
  // static async addToFavorites(req, res) {
  //   try {
  //     if (!req.)
  //   } catch (error) {
      
  //   }
  // }



}

module.exports = RecipesController;
