import express from'express';
import indexRouter from './index';
import referenceRouter from './references';
import authRouter from './auth';
import usersRouter from './users';
import beneficiariesRouter from './beneficiaries';
import activitiesRouter from './activities';
import rolesRouter from './roles';
import workshopsRouter from './workshops';
import ratingsRouter from './ratings';
import associationsRouter from './associations';
import itemsRouter from './items';
import wineriesRouter from './wineries';
import eventsRouter from './events';

const router = express.Router();


router.use('/', indexRouter);
router.use('/references', referenceRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/beneficiaries', beneficiariesRouter);
router.use('/activities', activitiesRouter);
router.use('/roles', rolesRouter);
router.use('/workshops', workshopsRouter);
router.use('/ratings', ratingsRouter);
router.use('/associations',associationsRouter);
router.use('/items',itemsRouter);
router.use('/wineries',wineriesRouter);
router.use('/events',eventsRouter);

export default router;