import express from 'express';
import multer from 'multer';
import * as controller from '../controllers/beneficiary';
import * as auth from '../middlewares/auth';
import * as ls from '../services/localUpload';

const resourceName = 'beneficiary';
const router = express.Router();

router.post('/', auth.allowIfLoggedin, auth.grantAccess('create', resourceName), controller.save);
router.get("/", auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.getAll)
router.post("/filter", auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.filter);
router.post('/resources', auth.allowIfLoggedin, ls.uploadLS.single('file'), controller.uploadResource);
router.get('/:id', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.get);
router.put('/:id', auth.allowIfLoggedin, auth.grantAccess('update', resourceName), controller.update);
router.delete('/:id', auth.allowIfLoggedin, auth.grantAccess('delete', resourceName), controller.deleteItem);

export default router;