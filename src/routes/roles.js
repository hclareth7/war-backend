const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles');
const auth = require('../middlewares/auth');

//ROLES
router.post('/', auth.allowIfLoggedin, rolesController.save);
router.get("/", auth.allowIfLoggedin, rolesController.getAll)
router.get('/:id', auth.allowIfLoggedin, rolesController.get);
router.put('/:id', auth.allowIfLoggedin, rolesController.update);
router.delete('/:id', auth.allowIfLoggedin, rolesController.delete);



module.exports = router