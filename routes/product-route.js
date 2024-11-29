
const express = require('express')
const router = require('express').Router();
const userController = require('../controller/product-controller')
const superAdminAuth = require('../auth/superAdminAuth')
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
router.post('/items',superAdminAuth , upload.single('image') ,userController.addProduct);
router.get('/items',superAdminAuth  ,userController.ProductList);
router.put('/items/:id',superAdminAuth , upload.single('image') ,userController.updateProduct);
router.delete('/items/:id',superAdminAuth ,userController.deleteProduct);

module.exports = router