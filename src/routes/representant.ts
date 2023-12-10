import express from 'express';
import * as controller from '../controllers/representant';
import * as auth from '../middlewares/auth';

const router = express.Router();

//REPRESENTANT
const resourceName = 'representant';
router.post('/', auth.allowIfLoggedin, auth.grantAccess('create', resourceName), controller.save);
router.get("/", auth.allowIfLoggedin, controller.getAll)
router.get('/:id', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.get);
router.get('/deliverys/pdf/:id/:idEvent', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.getDeliverysPdf);
router.put('/:id', auth.allowIfLoggedin, auth.grantAccess('update', resourceName),controller.update);
router.delete('/:id', auth.allowIfLoggedin, auth.grantAccess('delete', resourceName),controller.deleteItem);


export default router