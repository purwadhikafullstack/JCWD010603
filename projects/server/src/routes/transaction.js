const express = require("express");
const router = express.Router();
const { transactionController } = require("../controller");
const { fileUploader, upload } = require("../middleware/multer");
router.get(
  "/counttransactionbybranch/:id",
  transactionController.getCountTransactionByBranch
);
router.get("/counttransaction", transactionController.getCountTransaction);
router.get(
  "/getIncomeTransactionByBranch/:id",
  transactionController.getIncomeTransactionByBranch
);
router.get("/transaction-header", transactionController.getData);
router.patch(
  "/confirmtransaction/:noTrans",
  transactionController.updateStatusDeliver
);
router.get(
  "/transaction-detail/:id",
  transactionController.getTransactionDetail
);
router.get(
  "/gettransactionbynotrans/:noTrans",
  transactionController.getTransactionByNoTransaction
);
router.post("/create-transaction/:id", transactionController.addTranscation);
router.patch(
  "/uploadfoto/:noTrans",
  fileUploader({
    destinationFolder: "IMAGE_UPLOAD",
    fileType: "image",
    prefix: "POST",
  }).single("image"),
  transactionController.uploadFoto
);
module.exports = router;
