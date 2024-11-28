const express = require("express");
const jwt = require("jsonwebtoken");    
const User = require("../models/user-model");
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
    try {
      const { name, email, phone, password, confirmPassword } = req.body;
      const isUserExist = await User.findOne({ email :email});
        if (isUserExist) {
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
        if (password !== confirmPassword) {
          return res.json({ message: "confirm password are not match" })
        }

      const data = new User({
        ...req.body,
        profilePic: req.file ? req.file.filename : null
    })
      await data.generateAuthToken();
      const newuser = await data.save();
    if(newuser){
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
      const ismatch = await bcrypt.compare(password, admindata.password);
      if (ismatch && admindata) {
        const token = jwt.sign({ id: admindata._id, email: admindata.email }, process.env.SECRATEKEY, {expiresIn: '1d'});
        admindata = admindata.toObject()
        admindata.tempToken = token
        return res.json({ message: "OK", data: admindata });
      } else {
        return res.status(400).json("invalid userdata");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
};
