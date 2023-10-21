import express from 'express';
import * as controller from '../controllers/winerie';
import * as auth from '../middlewares/auth';

const router = express.Router();

//WINERIES (BODEGAS)
const resourceName = 'winery';
router.post('/', auth.allowIfLoggedin, auth.grantAccess('create', resourceName), controller.save);
router.get("/", auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.getAll)
router.get('/:id', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.get);
router.put('/:id', auth.allowIfLoggedin, auth.grantAccess('update', resourceName),controller.update);
router.delete('/:id', auth.allowIfLoggedin, auth.grantAccess('delete', resourceName),controller.deleteItem);
router.delete('/:idWinerie/:idItem', auth.allowIfLoggedin, auth.grantAccess('delete', resourceName),controller.deleteItemWinerieInventary);


export default router