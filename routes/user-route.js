const express = require('express')
const router = require('express').Router();
const userController = require('../controller/user-controller')
const adminauth = require('../auth/adminAuth')
const multer = require('multer')

router.use('/', express.static('uploadedfile/uploads'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploadedfile/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

router.post('/register',adminauth ,  upload.single('profilePic') , userController.register);
router.post('/login', userController.login);

module.exports = router