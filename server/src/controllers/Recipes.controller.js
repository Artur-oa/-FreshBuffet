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
   // Метод получения одного рецепта по id
  static async getRecipeById (req, res) {
    try {
      const { id } = req.params
      const recipe = await RecipesService.getById(id)
      if (!recipe) {
        return res.status(404).json(formatResponse(404, "Рецепт не найден", null, "Рецепт не найден"))
    } 
      res.status(200).json(formatResponse(200, "Рецепт получен", recipe))
    }  catch ({message}) {
      console.error(message)
      res.status(500).json(formatResponse(500, "Внутренняя ошибка сервера", null, message))
    }
  }

}

module.exports = RecipesController;
