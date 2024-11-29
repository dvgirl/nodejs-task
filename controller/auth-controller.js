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
  confirmPassword: Joi.any().valid(Joi.ref('password')).required()  
});
exports.register = async (req, res) => {
    try {
      const { email} = req.body;
      const isUserExist = await User.findOne({ email :email});
        if (isUserExist) {
          return res.json({ message: 'OK', data: "email alredy exist please try again" })
        }
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json(error.message);
    }
    else {
      const data = new User(req.body)
      const newuser = await data.save();
      res.json({ message: 'OK', data: newuser})
    }
    } catch (err) {
      res.status(500).json({ message: err })
    }
}
exports.login = async (req, res) => {
    try {
      const password = req.body.password;
      const email = req.body.email;
      let admindata = await User.findOne({ email: email });
      if(admindata){
      const ismatch = await bcrypt.compare(password, admindata.password);
      if (ismatch && admindata) {
        const token = jwt.sign({ id: admindata._id, email: admindata.email }, process.env.SECRATEKEY, {expiresIn: '1d'});
        const userdata = await User.findOneAndUpdate({_id : admindata._id }, {$set : {token : token}} ,{new : true})
        return res.json({ message: "OK", data: userdata });
      } else {
        return res.status(400).json("invalid userdata");
      }
    }
    else {
      return res.status(400).json("user not found");
    }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
};
