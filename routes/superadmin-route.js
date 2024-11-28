const express = require('express')
const router = require('express').Router();
const superAdminController = require('../controller/superadmin-controller')
const superAdminAuth = require('../auth/superAdminAuth')

router.post('/createadmin',superAdminAuth , superAdminController.createAdmin);
router.get('/adminList',superAdminAuth , superAdminController.adminList);
router.get('/admin/:id',superAdminAuth , superAdminController.getAdmin);
router.put('/admin/:id',superAdminAuth , superAdminController.updateAdmin);
router.delete('/admin/:id',superAdminAuth , superAdminController.deleteAdmin);

module.exports = router