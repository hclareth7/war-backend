import express from 'express';
import * as controller from '../controllers/association';
import * as auth from '../middlewares/auth';

const router = express.Router();


const resourceName = 'association';
router.post('/', auth.allowIfLoggedin, auth.grantAccess('create', resourceName), controller.save);
router.get("/", auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.getAll)
router.get('/:id', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.get);
router.put('/:id', auth.allowIfLoggedin, auth.grantAccess('update', resourceName),controller.update);
router.delete('/:id', auth.allowIfLoggedin, auth.grantAccess('delete', resourceName),controller.deleteItem);
router.post("/pdf", controller.generatePdf);

export default router;