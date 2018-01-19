'use strict';

const jwt = require('jsonwebtoken')
const config = require('../../config')


const Token = require('../models/tokenModel')

module.exports = function(req, res){
    if(req.body.refreshToken){

        const user_id = req.body.refreshToken.split('.')[0];

        Token.findOne(
            {
                refreshToken: req.body.refreshToken
            },
            (err, token)=>{
                if(err) res.send(err)

                if(!token){
                    res.status(401).send('Token not found')
                }else{
                    if(!token.user_id == user_id){
                        res.status(401).send('User mismatch')
                    }else{
                        /* * * * * *
                        *  SUCCESS *
                        * * * * *  */

                        // payload of JWT token
                        const payload = {
                            id: user_id
                        }
                        // generate JWT access token which expires in 5 minutes
                        const accessToken = jwt.sign(payload, config.jwtSecret, {expiresIn: 300})

                        res.json({
                            accessToken: accessToken
                        })
                    }
                }
            }
        )
    }else{
        res.status(401).send('Invalid parameters')
    }
}