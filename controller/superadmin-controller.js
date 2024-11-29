const express = require("express");
const jwt = require("jsonwebtoken");    
const User = require("../models/user-model");
const bcrypt = require('bcrypt')
const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().length(10).required(),
    password: Joi.string().min(6).required(),
    createdBy: Joi.string().min(3),
});

exports.createAdmin = async (req, res) => {
    try {
      const { email } = req.body;
      const isAdminExist = await User.findOne({ email :email});
        if (isAdminExist) {
          return res.json({ message: 'OK', data: "email alredy exist please try again" })
        }
        const { error } = registerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            console.log(error)
          return res.status(400).json(error.message);
        }
        else {
        const data = new User({...req.body,role:1}) 
        const newAdmin = await data.save();
        res.json({ message: 'OK', data: newAdmin})
    }
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: err })
    }
}

exports.adminList = async (req , res)=> {
    try{
        const { name ,phone , status , page = 1, limit = 10} = req.query;
        const obj = {
            role : 1
        }   
        if (name || phone) {
            obj.$or = [];
            if (name) {
                obj.$or.push({ name: { $regex: name, $options: 'i' } });
            }
            if (phone) {
                obj.$or.push({ phone: { $regex: phone, $options: 'i' } });
            }
        }
        if (status) {
            obj.status = status;
        }
        
        const skip = (page - 1) * limit;
        const totalItems = await User.countDocuments(obj);
        const adminList = await User.find(obj).skip(skip).limit(limit);;

        res.json({ message: 'OK', 
            result: {
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            limit,
          },
          data: adminList})
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    }
}

exports.getAdmin = async (req , res)=> {
    try{
        const { id } = req.params;
        const adminData = await User.findOne({ _id : id })
        res.json({ message: 'OK', data: adminData})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    }
}

exports.updateAdmin = async (req , res)=> {
    try{
        const { id } = req.params;
        const adminData = await User.findOneAndUpdate({ _id : id } , {$set :req.body} , {new :true})
        res.json({ message: 'OK', data: adminData})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    }
}

exports.deleteAdmin = async ( req , res)=> {
    try{
        const { id } = req.params;
        const adminData = await User.findOneAndDelete({ _id : id })
        res.json({ message: 'OK', data: adminData})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: err })
    } 
}