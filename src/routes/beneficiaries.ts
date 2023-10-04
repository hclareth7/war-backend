import express from 'express';
import multer from 'multer';
import * as controller from '../controllers/beneficiary';
import * as auth from '../middlewares/auth';

const resourceName = 'beneficiary';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'),auth.allowIfLoggedin, auth.grantAccess('create', resourceName), controller.save);
router.get("/", auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.getAll)
router.post("/filter", auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.filter);
router.post('/photo', upload.single('file'), auth.allowIfLoggedin, auth.grantAccess('update', resourceName), controller.updatePhoto);
router.get('/:id', auth.allowIfLoggedin, auth.grantAccess('read', resourceName), controller.get);
//router.put('/:id', auth.allowIfLoggedin, auth.grantAccess('update', resourceName), controller.update);
router.delete('/:id', auth.allowIfLoggedin, auth.grantAccess('delete', resourceName), controller.deleteItem);
router.post('/nuevop/:id',upload.fields([
    {name: 'fosyga'},{name: 'sisben'}
]),auth.allowIfLoggedin, auth.grantAccess('update', resourceName),controller.updateResources);

export default router; 