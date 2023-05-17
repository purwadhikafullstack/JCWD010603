const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { join } = require("path");
const db = require("./models");
const route = require("./routes");
const mysql = require("mysql2");
const PORT = process.env.PORT || 8000;
const app = express();
// app.use(
//   cors({
//       origin: [
//         process.env.WHITELISTED_DOMAIN &&
//           process.env.WHITELISTED_DOMAIN.split(","),
//       ],
//   })
// );
app.use(cors());
const options = {
  // origin: "https://jcwd010603.purwadhikabootcamp.com",
  origin: "http://localhost:3000",
};
app.use(cors(options));

app.use(express.json());
// db.sequelize.sync({ alter: true });

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.use("/api/user", route.userRoute);
app.use("/api/admin", route.adminRoute);
app.use("/api/address", route.addressRoute);
app.use("/api/cart", route.cartRoute);
app.use("/api/product", route.productRoute);
app.use("/api/stock", route.stockRoute);
app.use("/api/voucher_discount", route.voucherDiscountRoute);
app.use("/api/transaction", route.transactionRoute);
app.use("/api/api_rajaongkir", route.rajaOngkirRoute);
app.use("/image_product", express.static(`${__dirname}/public/IMAGE_PRODUCT`));
app.use("/user/avatar", express.static(`${__dirname}/public/IMAGE_USER`));
app.use(
  "/post_image/upload",
  express.static(`${__dirname}/public/IMAGE_UPLOAD`)
);
// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
