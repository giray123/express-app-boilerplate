'use strict';

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
}, {
    versionKey: false
})

UserSchema.pre('save', function(next){
    var user = this
    bcrypt.hash(user.password, 10, (err, hash)=>{
        if(err) return next(err)
        user.password = hash
        next()
    })
})

// first parameter of the model is the singular name
// of the collection the model is for. Mongoose automatically
// looks for the plural version of your model name
// so model 'Tank' is for collection 'Tanks'

module.exports = mongoose.model('User', UserSchema)