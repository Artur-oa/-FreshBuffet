const { Recipe } = require("../../db/models");

class RecipesService {
  // Получаем всех пользователей из БД
  static async getAll() {
    return await Recipe.findAll();
  }
}

module.exports = RecipesService;
