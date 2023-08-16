const express = require('express')
const router = express.Router()
const controller = require('../controllers/activity')
const auth = require('../middlewares/auth');




router.post('/', auth.allowIfLoggedin, controller.save);
router.get("/", auth.allowIfLoggedin, controller.getAll)
router.get('/:id', auth.allowIfLoggedin, controller.get);
router.put('/:id', auth.allowIfLoggedin, controller.update);
router.delete('/:id', auth.allowIfLoggedin, controller.delete);

module.exports = router