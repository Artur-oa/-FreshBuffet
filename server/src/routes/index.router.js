const router = require("express").Router();
const path = require('path')
const recipesRoutes = require("./recipes.routes.js");
const authRoutes = require('./auth.router.js')
const userRoutes = require('./user.router.js')


router.use("/recipes", recipesRoutes);
router.use('/auth', authRoutes)
router.use('/users', userRoutes);
router.use('/avatars', require('express').static(path.join(__dirname, '../public/assets')));

// Прочие сущности
// router.get("/users/:id/events", UserController.getAllEventsForUser);

module.exports = router;
