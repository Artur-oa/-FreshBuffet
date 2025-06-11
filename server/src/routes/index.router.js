const router = require("express").Router();

// const authRoutes = require("./auth.routes.js");
const recipesRoutes = require("./recipes.routes.js");
const authRoutes = require('./auth.router.js')
// Основные маршруты
// router.use("/auth", authRoutes);
router.use("/recipes", recipesRoutes);
router.use('/auth', authRoutes)

// Прочие сущности
// router.get("/users/:id/events", UserController.getAllEventsForUser);

module.exports = router;