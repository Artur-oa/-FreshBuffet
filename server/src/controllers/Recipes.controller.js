const RecipesService = require("../services/Recipes.service");
const formatResponse = require("../utils/formatResponse");

class RecipesController {
  // Метод для получения всех пользователей
  static async getAllRecipes(req, res) {
    try {
      // Пулучаем всех пользователей
      const allRecipes = await RecipesService.getAll();

      res.status(200).json(formatResponse(200, "Все рецепты", allRecipes));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, "Внутренняя ошибка сервера", null, message));
    }
  }
}

module.exports = RecipesController;
