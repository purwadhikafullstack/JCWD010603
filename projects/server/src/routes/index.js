const userRoute = require("./user")
const adminRoute = require("./admin")
const addressRoute = require("./address")
const productRoute = require("./product")
const stockRoute = require("./stock")
const rajaOngkirRoute = require("./rajaOngkir")
const cartRoute = require("./cart")
const transactionRoute = require("./transaction")
const voucherDiscountRoute = require("./voucher-discount")

module.exports = {
    adminRoute,
    userRoute,
    productRoute,
    stockRoute,
    rajaOngkirRoute,
    addressRoute,
    cartRoute,
    transactionRoute,
    voucherDiscountRoute
};
