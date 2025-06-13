const router = require('express').Router()

const AuthController = require('../controllers/Auth.controller');
const { checkBody } = require('../middlewares/checkBody');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken');

router.post('/register', checkBody, AuthController.register)
      .post('/login', checkBody, AuthController.login)
      .get('/logout', AuthController.logout)
      .get('/refresh', verifyRefreshToken, AuthController.refreshTokens)

module.exports = router