const router = require("express").Router();
const UserController = require("../controllers/User.controller.js");

// const authRoutes = require("./auth.routes.js");
// const eventsRoutes = require("./events.routes.js");

// Основные маршруты
// router.use("/auth", authRoutes);
router.use("/recipes", recipesRoutes);

// Прочие сущности
router.get("/users/:id/events", UserController.getAllEventsForUser);

module.exports = router;