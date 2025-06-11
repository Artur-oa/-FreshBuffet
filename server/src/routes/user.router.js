// const router = require('express').Router()
// const { checkBody, checkId } = require('../middlewares/checkBody')
// const UserController = require('../controllers/User.controller')
// const verifyAccessToken = require('../middlewares/verifyAccessToken')


// router.get('/register', (req, res) => {
//   console.log(req.query)
//   res.status(200).sendFile(path.resolve(__dirname, '../registerForm.html'))
// })

// router
//   .get('/', UserController.getAll)
//   .get('/:id', UserController.getOne)
//   .delete('/:id', verifyAccessToken, checkId, UserController.delete)
//   .put('/:id', verifyAccessToken, UserController.update)

// module.exports = router