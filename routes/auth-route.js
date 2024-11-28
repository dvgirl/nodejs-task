const express = require('express')
const router = require('express').Router();
const userController = require('../controller/auth-controller')
const adminauth = require('../auth/adminAuth')

router.post('/register',userController.register);
router.post('/login',   userController.login);

module.exports = router