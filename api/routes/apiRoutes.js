'use strict';

const express = require('express')
const router = express.Router()
const auth = require('../../auth')()

//all routes here require `/api` before their respective URL path

/* * * * * *  *
* AUTH ROUTES *
* * * * * * * */

// normal login
const loginController = require('../controllers/loginController')
router.post('/login', loginController)

//generate token
const tokenController = require('../controllers/tokenController')
router.post('/token', tokenController)

// social logins
router.get('/auth/facebook', auth.facebook())
router.get('/auth/facebook/callback', auth.facebook_callback())
router.get('/auth/twitter', auth.twitter())
router.get('/auth/twitter/callback', auth.twitter_callback())
router.get('/auth/google', auth.google())
router.get('/auth/google/callback', auth.google_callback())

//secret route
router.use('/secret', auth.authenticate(), (req, res)=>{
    res.json({
        msg: 'secret path',
        params: req.params,
        body: req.body,
        user: req.user
    })
})

//data routes
const companyRoutes = require('./companyRoutes')
router.use('/companies', companyRoutes)

const userRoutes = require('./userRoutes')
router.use('/users', userRoutes)

module.exports = router