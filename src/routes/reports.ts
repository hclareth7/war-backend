import express from 'express';
import * as controller from '../controllers/report';
import * as auth from '../middlewares/auth';

const router = express.Router();


const resourceName = 'report';
router.post('/', auth.allowIfLoggedin, controller.generateReports);

export default router;