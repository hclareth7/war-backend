const express = require('express')

const router = express.Router()

var indexRouter = require('./index');
var authRouter = require('./auth');
var usersRouter = require('./users');
var beneficiariesRouter = require('./beneficiaries');
var activitiesRouter = require('./activities');

router.use('/', indexRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/beneficiaries', beneficiariesRouter);
router.use('/activities', activitiesRouter);

module.exports = router