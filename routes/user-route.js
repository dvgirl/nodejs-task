
const express = require('express')
const router = require('express').Router();
const userController = require('../controller/user-controller')
const userAuth = require('../auth/tokenAuth')

router.get('/items',userAuth ,userController.ProductList);
router.post('/items/rating',userAuth ,userController.addRating);
router.get('/items/rating',userAuth ,userController.getItemRatings);


module.exports = router