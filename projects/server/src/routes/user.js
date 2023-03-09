const express = require("express");
const router = express.Router();
const {validate, userValidateRules} = require("../middleware/validator")
const {userController} = require("../controller")

router.post("/register", userValidateRules(), validate, userController.register)
router.get("/verify/:token", userController.verify)
router.get("/keeplogin", userController.keeplogin);

module.exports = router;
