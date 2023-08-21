import express from 'express';
import * as rolesController from '../controllers/roles';
import * as auth from '../middlewares/auth';

const router = express.Router();

//ROLES
router.post('/', auth.allowIfLoggedin, rolesController.save);
router.get("/", auth.allowIfLoggedin, rolesController.getAll)
router.get('/:id', auth.allowIfLoggedin, rolesController.get);
router.put('/:id', auth.allowIfLoggedin, rolesController.update);
router.delete('/:id', auth.allowIfLoggedin, rolesController.deleteItem);


export default router