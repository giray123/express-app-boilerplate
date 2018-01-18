'use strict';

const config = require('../../config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//User model
const User = require('../models/userModel')

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
                            // generate JWT token
                            const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '7d'})
                            //expired jwt for debugging
                            // const token = jwt.sign({id: user.id, exp: 1514840023}, config.jwtSecret)
                            // send JWT token
                            res.json({
                                token: token
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