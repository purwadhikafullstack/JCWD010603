const express = require("express");
const router = express.Router();
const { cartController } = require("../controller");

router.get("/getcart", cartController.getCartData);
router.delete("/deleteCart/:id", cartController.deleteCartData);
router.post("/addCart", cartController.createCartData);
router.get("/getcartbyUserId/:id", cartController.getCartByUserId);
router.get("/getweightcartbyUserId/:id", cartController.getCartByWeight);
router.patch("/editcart/:id", cartController.patchCartData);

module.exports = router;