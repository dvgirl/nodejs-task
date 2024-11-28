const express = require("express");
const jwt = require("jsonwebtoken");    
const User = require("../models/user-model");

exports.register = async (req, res) => {
    try {
      const data = new User({
        ...req.body,
        profilePic: req.file ? req.file.filename : null
    })
      await data.generateAuthToken();
      await data.save();
      res.json({ message: 'OK', data: "register suceesfull" })
    } catch (err) {
      res.status(500).json({ message: 'OK', data: err })
    }
}
exports.login = async (req, res) => {
    try {
      const password = req.body.password;
      const email = req.body.email;
  
      const admindata = await User.findOne({ email: email });
      const ismatch = await bcrypt.compare(password, admindata.password);
      if (ismatch && admindata) {
        return res.json({ message: "OK", data: admindata });
      } else {
        return res.status(400).json("invalid user");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
};