const router = require('express').Router()
const { checkBody, checkId } = require('../middlewares/checkBody')
const UserController = require('../controllers/User.controller')
const verifyAccessToken = require('../middlewares/verifyAccessToken')
const authMiddleware = require('../middlewares/authMiddleware')
const path = require('path');

router.get('/register', (req, res) => {
  console.log(req.query)
  res.status(200).sendFile(path.resolve(__dirname, '../registerForm.html'))
})

router
  .get('/', UserController.getAll)
  .get('/:id', UserController.getOne)
  .delete('/:id', verifyAccessToken, checkId, UserController.delete)
  .put('/:id', verifyAccessToken, UserController.update)
  .put('/profile/avatar', authMiddleware, UserController.uploadAvatar)
  .get('/profile', authMiddleware, UserController.getProfile);

module.exports = router