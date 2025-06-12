const router = require("express").Router();
const FavoritesController = require("../controllers/Favorites.controller.js");
const RecipesController = require("../controllers/Recipes.controller.js");

router.get("/favorites/:userId", FavoritesController.getFavorites);
router.post("/favorites/:recipeId", FavoritesController.addFavorite)
router.delete("/favorites/:recipeId", FavoritesController.removeFavorite)

// Маршруты для рецептов
router.get("/", RecipesController.getAllRecipes); // Получить все события
router.post("/load", RecipesController.loadFromApi);
router.get("/:id", RecipesController.getRecipeById); // Получить одно событие по id (подсказка – params)


module.exports = router;
