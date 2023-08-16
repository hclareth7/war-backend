const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middlewares/auth');

//USER
router.post('/', userController.save);
router.get("/", auth.allowIfLoggedin, userController.getAll)
router.put('/:id', auth.allowIfLoggedin, userController.update);
router.delete('/:id', auth.allowIfLoggedin, userController.delete);



module.exports = router