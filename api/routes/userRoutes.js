'use strict';

const express = require('express')
const router = express.Router()

const auth = require('../../auth')()

//get CRUD functions (controller) of companies
const users = require('../controllers/userController')

router.use(auth.initialize());
// router.use(auth.authenticate())

router.route('/')
    .get(auth.authenticate(), users.all)
    .post(users.insert)

router.get('/auth', users.all)

router.route('/:userId')
    .get(users.get_one)
    .put(users.update)
    .delete(users.delete)

module.exports = router