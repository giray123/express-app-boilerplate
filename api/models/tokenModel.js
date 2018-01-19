'use strict';

const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: 'user_id is mandatory'
    },
    refreshToken: {
        type: String,
        required: 'refreshToken is mandatory'
    },
    date_created: {
        type: Date,
        default: Date.now
    }
}, {versionKey: false})

// first parameter of the model is the singular name
// of the collection the model is for. Mongoose automatically
// looks for the plural version of your model name
// so model 'Tank' is for collection 'Tanks'

module.exports = mongoose.model('Token', TokenSchema)