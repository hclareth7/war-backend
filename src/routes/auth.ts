import express from 'express';

import * as authController from '../middlewares/auth';

const router = express.Router();

//AUTH
router.post('/login', authController.login);

export default router;