'use strict';

const mongoose = require('mongoose')

//getting our registered Company schema
const Company = require('../models/companyModel')

exports.all = function(req, res){
    Company.find({}, (err, company)=>{
        if(err) res.send(err)
        res.json(company)
    })
}

exports.insert = function(req, res){
    const new_company = new Company(req.body)
    new_company.save((err, company)=>{
        if(err) res.send(err)
        res.json(company)
    })
}

exports.get_one = function(req, res){
    Company.findById(req.params.companyId, (err, company)=>{
        if(err) res.send(err)
        res.json(company)
    })
}

exports.update = function(req, res){
    Company.findOneAndUpdate(
        {_id:req.params.companyId},
        req.body,
        {new: true},
        (err, company)=>{
            if(err) res.send(err)
            res.json(company)
        }
    )
}

exports.delete = function(req, res){
    Company.deleteOne(
        {_id:req.params.companyId},
        (err, company)=>{
            if(err) res.send(err)
            res.send('company deleted')
        }
    )
}