
const express = require('express')
const router = require('express').Router();
const userController = require('../controller/user-controller')

router.get('/items',superAdminAuth , upload.single('image') ,userController.ProductList);

module.exports = router