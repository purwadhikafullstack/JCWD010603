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
router.get("/allBranchTransaction", transactionController.getAllTransaction)
router.get("/transactionStatus", transactionController.getTransactionStatus)
router.get("/allTransactionByBranch/:id", transactionController.getTransactionByBranch)
router.get("/getTransactionItem/:id", transactionController.getTransactionItem)
router.get("/productReport", transactionController.getSuperAdminDataByProduct);
router.get("/branchProductReport", transactionController.getBranchAdminDataByProduct);
router.get("/transactionReport", transactionController.getSuperAdminDataByTransaction);
router.get("/branchTransactionReport", transactionController.getBranchAdminDataByTransaction);
router.get("/userReport", transactionController.getAllUserTransactionData);
router.get("/branchUserReport", transactionController.getBranchUserTransactionData);
router.patch("/admincancelorder/:id", transactionController.adminCancelTransaction);
router.patch("/adminsendorder/:id", transactionController.adminSendTransaction);
router.get("/userTransactionList/:id", transactionController.getUserTransaction);
router.patch("/userTransactionStatus/:id", transactionController.updateTransactionStatus);

module.exports = router;
module.exports = router;
