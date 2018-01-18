'use strict';

const express = require('express')
const router = express.Router()


//get CRUD functions (controller) of companies
const companies = require('../controllers/companyController')

router.route('/')
    .get(companies.all)
    .post(companies.insert)

router.route('/:companyId')
    .get(companies.get_one)
    .put(companies.update)
    .delete(companies.delete)

module.exports = router