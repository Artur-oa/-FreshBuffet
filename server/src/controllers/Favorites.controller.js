const RecipesService = require("../services/Recipes.service");
const formatResponse = require("../utils/formatResponse");


class FavoritesController {

static async addFavorite(req, res) {
      const userId = req.user.id; // из токена
      const { recipeId } = req.params;
      // Проверка, нет ли уже такой записи
      await db.favorites.create({ user_id: userId, recipe_id: recipeId });
      res.status(201).json({ success: true });
    }


static async removeFavorite (req, res){
      const userId = req.user.id;
      const { recipeId } = req.params;
      await db.favorites.destroy({ where: { user_id: userId, recipe_id: recipeId } });
      res.json({ success: true });
    }
}

module.exports = FavoritesController