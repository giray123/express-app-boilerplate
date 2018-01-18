'use strict';

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/crm', {
    useMongoClient: true
})
//get mongoose use the global promise library
mongoose.Promise = global.Promise

//get default connection
var mongo_connection = mongoose.connection;
mongo_connection.on('error', console.error.bind(console, 'connection error:'))
mongo_connection.once('open', function() { console.log('database connected')})

module.exports = mongoose