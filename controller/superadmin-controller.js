const express = require("express");
const jwt = require("jsonwebtoken");    
const User = require("../models/user-model");
const bcrypt = require('bcrypt')

exports.createAdmin = async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const isAdminExist = await User.findOne({ email :email});
        if (isAdminExist) {
          return res.json({ message: 'OK', data: "email alredy exist please try again" })
        }
        const emailformate = /^\S+@\S+\.\S+$/;
        if (!emailformate.test(email)) {
          return res.json({ message: "please enter correct email and try again" })
        }
        if (name.length < 3) {
          return res.json({ message: "name must more then 3 latter" })
        }
        if (phone.length == 10) {
          return res.json({ message: "phone number must be 10 " })
        }
      const data = new User({
        ...req.body,
        role:1
    })
      await data.generateAuthToken();   
      const newAdmin = await data.save();
    if(newAdmin){
      res.json({ message: 'OK', data: newAdmin})
    }
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: err })
    }
}

exports.adminList = async (req , res)=> {
    try{
        const { name ,phone , status} = req.query;
        const obj = {
            role : 1
        }   
        if (name || phone) {
            // If name or phone exists, add an $or condition
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
        
        const adminList = await User.find(obj)
        res.json({ message: 'OK', data: adminList})

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