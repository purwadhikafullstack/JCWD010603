const express = require("express");
const adminController = require("../controller/admin");
const router = express.Router();

router.post('/adminlogin', adminController.login);

module.exports = router;
