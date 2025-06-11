const router = require("express").Router();
const RecipesController = require("../controllers/Recipes.controller.js");

// Маршруты для рецептов
router.get("/", RecipesController.getAllRecipes); // Получить все события
router.get("/:id", RecipesController.getRecipeById); // Получить одно событие по id (подсказка – params)

// Ручка дял загрузки данных из API в БД
router.post("/load", RecipesController.loadFromApi);

module.exports = router;
