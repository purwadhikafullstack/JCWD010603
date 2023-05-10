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
  origin: "http://localhost:3000",
};
app.use(cors(options));
const db_project = mysql.createConnection({
  host: process.env.host,
  port: 3306,
  user: process.env.user,

  password: process.env.pass,
  database: process.env.database,
});

db_project.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("db_project connected");
  }
});
app.use(express.json());
// db.sequelize.sync({ alter: true });

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.get("/api/product/filter-user", (req, res) => {
  const { order } = req.query;
  const { orderby } = req.query;
  const { BranchId } = req.query;
  delete req.query.order;
  delete req.query.orderby;
  delete req.query.BranchId;
  const arrQuery = Object.entries(req.query);
  let categories = arrQuery.filter((val) => {
    return val[0];
  });

  let where = "";

  /// start
  if (categories.length) {
    where = ` where (p.BranchId=${BranchId} and`;

    if (categories.length) {
      // console.log(categories);
      categories.map((val, idx) => {
        idx
          ? (where += `or c.name = '${val[0]}' `)
          : (where += ` c.name = '${val[0]}' `);
      });
    }

    where += ")";
  }

  ///end
  qString =
    "Select p.name,p.price,p.imgProduct,c.name as category FROM products p JOIN categories c on p.CategoryId=c.id" +
    where +
    " order by " +
    orderby +
    " " +
    order;

  db_project.query(qString, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        message: "query error",
      });
    }

    res.status(200).json({
      message: "data fetched",
      result: result,
    });
  });
});
app.get("/api/product/filter", (req, res) => {
  // console.log(req.query);
  const { order } = req.query;
  const { orderby } = req.query;
  delete req.query.order;
  delete req.query.orderby;
  const arrQuery = Object.entries(req.query);

  // console.log(categories);
  let categories = arrQuery.filter((val) => {
    return val[0];
  });

  let where = "";

  /// start
  if (categories.length) {
    where = " where (";

    if (categories.length) {
      // console.log(categories);
      categories.map((val, idx) => {
        idx
          ? (where += `or c.name = '${val[0]}' `)
          : (where += ` c.name = '${val[0]}' `);
      });
    }

    where += ")";
  }

  ///end

  qString =
    "Select p.name,p.price,p.imgProduct,c.name as category FROM products p JOIN categories c on p.CategoryId=c.id" +
    where +
    " order by " +
    orderby +
    " " +
    order;

  db_project.query(qString, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        message: "query error",
      });
    }

    res.status(200).json({
      message: "data fetched",
      result: result,
    });
  });
});
app.patch("/api/users/:id/password", (req, res) => {
  const id = parseInt(req.params.id);
  const { oldPassword, newPassword } = req.body;
  console.log(req.body);

  db_project.query(
    "SELECT password FROM users WHERE id = ?",
    [id],
    async (error, results, fields) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const password = results[0].password;
      const isPasswordCorrect = await bcrypt.compare(oldPassword, password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Old password is incorrect",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db_project.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, id],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            return res.status(500).json({
              message: "Internal Server Error",
            });
          }
          return res.send("Password updated successfully");
        }
      );
    }
  );
});

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
// app.get("*", (req, res) => {
//   res.sendFile(join(__dirname, clientPath, "index.html"));
// });

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
