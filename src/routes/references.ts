import express from 'express';
import * as controller from '../controllers/reference';
import * as auth from '../middlewares/auth';

const router = express.Router();

//AUTH
router.get('/', auth.allowIfLoggedin, controller.getAll);
router.get('/:ref', auth.allowIfLoggedin, controller.getByRefName);

export default router;