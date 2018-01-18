'use strict';

const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is mandatory'
    },
    address: {
        type: String
    },
    date_created: {
        type: Date,
        default: Date.now
    }
})

// first parameter of the model is the singular name
// of the collection the model is for. Mongoose automatically
// looks for the plural version of your model name
// so model 'Tank' is for collection 'Tanks'

module.exports = mongoose.model('Company', CompanySchema)