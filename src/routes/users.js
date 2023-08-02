const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

//AUTH
router.post('/login', userController.login);

//USER
router.post('/', userController.save);
router.get("/", userController.allowIfLoggedin, userController.getAll)
router.put('/:id', userController.allowIfLoggedin, userController.update);
router.delete('/:id', userController.allowIfLoggedin, userController.delete);



module.exports = router