import express from 'express';
import * as controller from '../controllers/roles';
import * as auth from '../middlewares/auth';

const router = express.Router();

//ROLES
const resourceName = 'role';
router.post('/', auth.allowIfLoggedin, auth.grantAccess('create', resourceName), controller.save);
router.get("/", auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.getAll)
router.get("/serch", auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.serch)
router.get('/:id', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.get);
router.put('/:id', auth.allowIfLoggedin, auth.grantAccess('update', resourceName),controller.update);
router.delete('/:id', auth.allowIfLoggedin, auth.grantAccess('delete', resourceName),controller.deleteItem);


export default router