'use strict';

const mongoose = require('mongoose')

//getting our registered Company schema
const User = require('../models/userModel')

exports.all = function(req, res){
    User.find({}, (err, user)=>{
        if(err) res.send(err)
        res.json(user)
    })
}

exports.insert = function(req, res){
    const new_user = new User(req.body)
    new_user.save((err, user)=>{
        if(err) res.send(err)
        res.json(user)
    })
}

exports.get_one = function(req, res){
    User.findById(req.params.userId, (err, user)=>{
        if(err) res.send(err)
        res.json(user)
    })
}

exports.update = function(req, res){
    User.findOneAndUpdate(
        {_id:req.params.userId},
        req.body,
        {new: true},
        (err, user)=>{
            if(err) res.send(err)
            res.json(user)
        }
    )
}

exports.delete = function(req, res){
    User.deleteOne(
        {_id:req.params.userId},
        (err, user)=>{
            if(err) res.send(err)
            res.send('user deleted')
        }
    )
}