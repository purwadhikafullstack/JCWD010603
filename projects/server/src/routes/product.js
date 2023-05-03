const express = require("express");
const router = express.Router();
const productController = require("../controller/product");
const { fileUploader } = require("../middleware/multer");
const uploadSingle = fileUploader({
  destinationFolder: "IMAGE_PRODUCT",
}).single("imgProduct");

router.post("/create", uploadSingle, productController.create);
router.patch("/edit/:id", uploadSingle, productController.edit);
router.delete("/delete/:id", productController.delete);
router.get(
  "/countproductbybranch/:id",
  productController.getCountProductByBranch
);
router.get("/product-all/", productController.getAllProduct);
router.get("/totalstockbybranch/:id", productController.getStockByBranch);
router.get("/productbybranch/:id", productController.getProductbyBranch);
router.get("/category", productController.getCategory);
router.get("/productall", productController.getProduct);
router.get("/detail-product/:id", productController.getProductById);
router.get("/find", productController.getProductByName);
router.get("/productsuggestion/:BranchId", productController.getProductSuggestion);
module.exports = router;
