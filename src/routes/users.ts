import express from 'express';
import * as userController from '../controllers/user';
import * as auth from '../middlewares/auth';

const router = express.Router();

//USER
router.post('/', userController.save);
router.get("/", auth.allowIfLoggedin, userController.getAll)
router.get('/:id', auth.allowIfLoggedin, userController.get);
router.put('/:id', auth.allowIfLoggedin, userController.update);
router.delete('/:id', auth.allowIfLoggedin, userController.deleteItem);



export default router