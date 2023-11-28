import express from 'express';
import * as controller from '../controllers/beneficiary';
import * as auth from '../middlewares/auth';
import * as ls from '../services/localUpload';
import * as config from '../config/config';

const resourceName = 'beneficiary';
const router = express.Router();
const cpUpload = ls.uploadLS.fields(config.CONFIGS.resourceDocuments);

router.post('/', auth.allowIfLoggedin, auth.grantAccess('create', resourceName), controller.save);
router.post('/pdf', auth.allowIfLoggedin, auth.grantAccess('create', resourceName), controller.getPdfListBeneficiarie);
router.get("/", auth.allowIfLoggedin, controller.getAll)
router.post("/filter", auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.filter);
router.post('/resources/:id', auth.allowIfLoggedin, cpUpload, controller.uploadResource);
router.get('/:id', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.get);
router.get('/activity/:activityId', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.getByActivity);
router.put('/:id', auth.allowIfLoggedin, auth.grantAccess('update', resourceName), controller.update);
router.delete('/:id', auth.allowIfLoggedin, auth.grantAccess('delete', resourceName), controller.deleteItem);
router.get('/resume/user', auth.allowIfLoggedin, controller.userResume);

export default router;