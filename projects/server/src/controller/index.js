const userController = require("./user")
const adminController = require("./admin")
const rajaOngkirController = require("./rajaOngkir")
const productController = require("./product")
const stockController = require("./stock")
const addressController = require("./address")
const cartController = require("./cart")
const transactionController = require("./transaction")
const voucherDiscountController = require("./voucher-discount")


module.exports = {
    adminController,
    userController,
    productController,
    stockController,
    rajaOngkirController,
    addressController,
    cartController,
    transactionController,
    voucherDiscountController
};
