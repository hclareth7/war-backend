const express = require('express')
const router = express.Router()
const controller = require('../controllers/activity')



router.post('/', controller.save);
router.get("/", controller.getAll)
router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router