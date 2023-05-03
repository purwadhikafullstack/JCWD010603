const express = require("express");
const router = express.Router();
const { stockController } = require("../controller");

router.get("/getType", stockController.getType)
router.get("/fetchRecordById/:id", stockController.fetchRecordById)
router.patch("/repairStock/:id", stockController.repairStock)

module.exports = router