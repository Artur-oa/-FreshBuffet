const router = require("express").Router();

const recipesRoutes = require("./recipes.routes.js");
const authRoutes = require('./auth.routes.js')

// Основные маршруты
router.use('/auth', authRoutes)
router.use("/recipes", recipesRoutes);

// Прочие сущности
// router.get("/users/:id/events", UserController.getAllEventsForUser);

module.exports = router;
