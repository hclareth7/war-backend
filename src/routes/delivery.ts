import express from 'express';
import * as controller from '../controllers/delivery';
import * as auth from '../middlewares/auth';

const router = express.Router();

//DELIVERY
const resourceName = 'delivery';
router.post('/', auth.allowIfLoggedin, auth.grantAccess('create', resourceName), controller.save);
router.get("/", auth.allowIfLoggedin, controller.getAll)
router.get('/:id', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.get);
router.get('/pdf/:id', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.generateActaDelivery);
router.put('/:id', auth.allowIfLoggedin, auth.grantAccess('update', resourceName),controller.update);
router.delete('/:id', auth.allowIfLoggedin, auth.grantAccess('delete', resourceName),controller.deleteItem);


export default router