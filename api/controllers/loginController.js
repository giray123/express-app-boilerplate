'use strict';

const config = require('../../config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const randToken = require('rand-token')

//User model
const User = require('../models/userModel')
const Token = require('../models/tokenModel')

module.exports = function(req, res) {
    if(req.body.email && req.body.password){
        User.findOne(
            {
                email: req.body.email
            },
            (err, user)=>{
                if(err) res.send(err)

                if(!user){
                    res.status(401).send('Authentication failed. Code: 1')
                }else{
                    bcrypt.compare(req.body.password, user.password, (err, result)=>{
                        if(!result){
                            res.status(401).send('Authentication failed. Code: 2')
                        }else{
                            /* * * * * *
                            *  SUCCESS *
                            * * * * *  */

                            // payload of JWT token
                            const payload = {
                                id: user.id
                            }
                            // generate JWT access token which expires in 5 minutes
                            const accessToken = jwt.sign(payload, config.jwtSecret, {expiresIn: config.app.auth.accessToken.expiresIn})
                            // expired jwt for debugging
                            // const token = jwt.sign({id: user.id, exp: 1514840023}, config.jwtSecret)

                            // generate refresh token in the for of `user_id.uid`
                            const refreshToken = new Token({
                                user_id: user.id,
                                refreshToken: user.id+'.'+randToken.uid(40)
                            })

                            // save refreshToken to database
                            refreshToken.save((err, user)=>{
                                if(err) res.send(err)
                                // send JWT token
                                res.json({
                                    accessToken: accessToken,
                                    refreshToken: refreshToken.refreshToken
                                })

                            })

                        }
                    })
                }
            }
        )
    }else{
        res.status(401).send('Invalid parameters')
    }
}