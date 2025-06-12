const router = require('express').Router()

const AuthController = require('../controllers/Auth.controller');
// const { checkBody } = require('../middlewares/checkBody');
// const verifyRefreshToken = require('../middlewares/verifyRefreshToken');

router.post('/signUp', AuthController.signUp);
router.post('/signIn', AuthController.signIn);
router.get('/signOut', AuthController.signOut);

// router.post('/signUp', checkBody, AuthController.register)
//       .post('/signIn', checkBody, AuthController.login)
//       .get('/signOut', AuthController.logout)
//       .get('/refresh', verifyRefreshToken, AuthController.refreshTokens)

module.exports = router