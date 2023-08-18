const express = require('express');
const router = express.Router();
const controller = require('../controllers/reference');
const auth = require('../middlewares/auth');

//AUTH
router.get('/', auth.allowIfLoggedin, controller.getAll);
router.get('/:ref', auth.allowIfLoggedin, controller.getByRefName);

module.exports = router;