const express = require("express");
const router = express.Router();
const { userController } = require("../controller");
const adminController = require("../controller/admin");
const { validate, userValidateRules } = require("../middleware/validator");
const { fileUploader, upload } = require("../middleware/multer");
const { verifyToken } = require("../middleware/auth");

router.post(
  "/register",
  userValidateRules(),
  validate,
  userController.register
);
router.patch(
  "/updatefoto/:UserId",
  fileUploader({
    destinationFolder: "IMAGE_PRODUCT",
    fileType: "image",
    prefix: "POST",
  }).single("image"),
  userController.updateFoto
);
// router.patch("/updatefoto", upload.single("image"), userController.updateFoto);
// router.get("/avatar/:id", userController.renderAvatar);
// router.patch("/editpassword", verifyToken, userController.editPassword);
router.get("/verify/:token", userController.verify);
router.post("/userlogin", userController.login);
router.post("/request-reset", userController.resetRequest);
router.post("/reset-password/:token", userController.resetPassword);
router.get("/update-user", userController.getUserDetail);
router.get("/:UserId", userController.getUserbyUserId);
router.patch("/password/:id", verifyToken, userController.changePassword);
// router.get("/countuser/:id", userController.getCountUserByBranch);
router.patch("/editprofile/:id", userController.editProfile);
module.exports = router;
