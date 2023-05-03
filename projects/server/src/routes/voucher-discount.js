const express = require("express");
const router = express.Router();
const { voucherDiscountController } = require("../controller");

router.post("/addvouchertype", voucherDiscountController.createVoucherType);
router.get("/vouchertype", voucherDiscountController.getVoucherType);
router.delete(
  "/deletevouchertype/:id",
  voucherDiscountController.deleteVoucherType
);
router.post("/addvoucher", voucherDiscountController.createVoucher);
router.get("/getvoucher", voucherDiscountController.getVoucher);
router.delete("/deletevoucher/:id", voucherDiscountController.deleteVoucher);
router.get("/getallvoucher", voucherDiscountController.getAllVoucher);
router.get("/listvoucher", voucherDiscountController.listVoucher);
module.exports = router;
