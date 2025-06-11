const { Recipe } = require("../../db/models");

class RecipesService {
  // Получаем всех пользователей из БД
  static async getAll() {
    return await Recipe.findAll();
  }

  // Метод для получения одного рецепта по первичному ключу id
  static async getById(id) {
    return await Recipe.findByPk(id)
  } 

}

module.exports = RecipesService;
