import express from 'express';
import * as controller from '../controllers/beneficiary';
import * as auth from '../middlewares/auth';

const router = express.Router()

router.post('/', auth.allowIfLoggedin, controller.save);
router.get("/", auth.allowIfLoggedin, controller.getAll)
router.get('/:id', auth.allowIfLoggedin, controller.get);
router.put('/:id', auth.allowIfLoggedin, controller.update);
router.delete('/:id', auth.allowIfLoggedin, controller.deleteItem);

export default router;