const RecipesService = require("../services/Recipes.service");
const formatResponse = require("../utils/formatResponse");
const { Favorite, Recipe } = require("../../db/models");

class FavoritesController {
  static async addFavorite(req, res) {
    try {
    const { userId } = req.body;
    // console.log('--------------,', userId);
    

    const { recipeId } = req.params;
    
    // Проверяем, существует ли уже такая запись
    const existingFavorite = await Favorite.findOne({
      where: { userId, recipeId }
    });

    if (existingFavorite) {
      return res.status(400).json(
        formatResponse({
          statusCode: 400,
          message: "Рецепт уже в избранном",
          data: existingFavorite,
        })
      );
    }

    const favorite = await Favorite.create({ userId, recipeId });
    res.status(201).json(
      formatResponse({
        statusCode: 201,
        message: "Рецепт добавлен в избранное",
        data: favorite,
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).json(
      formatResponse({
        statusCode: 500,
        message: "Ошибка при добавлении в избранное",
        error: error.message,
      })
    );
  }
  }

  static async removeFavorite(req, res) {
    try {
      const userId = req.user.id;
      const { recipeId } = req.params;
      await Favorite.destroy({ where: { userId: userId, recipeId: recipeId } });
      res
        .status(200)
        .json(
          formatResponse({ statusCode: 200, message: "Рецепт удален из избранного", data: null }),
        );
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(
          formatResponse({
            statusCode: 500,
            message: "Ошибка при удалении из избранного",
            error: error.message,
          }),
        );
    }
  }

  static async getFavorites(req, res) {
    try {
      const {userId} = req.params;
      const favorites = await Favorite.findAll({
        where: { userId: userId },
        include: [Recipe],
      });

      res.status(200).json(
        formatResponse({
          statusCode: 200,
          message: "Избранные рецепты получены",
          data: favorites.map(fav => fav.Recipe),
        }),
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(
        formatResponse({
          statusCode: 500,
          message: "Ошибка при получении избранных рецептов",
          error: error.message,
        }),
      );
    }
  }
}

module.exports = FavoritesController;
