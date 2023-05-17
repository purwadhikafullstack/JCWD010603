const jwt = require("jsonwebtoken");
const secret = process.env.secret_key;

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("access denied / unauthorized request");
  }

  try {
    token = token.split(" ")[1];

    if (token === "null" || !token) {
      return res.status(401).send("unauthorized request 1");
    }

    let verifiedUser = jwt.verify(token, secret);
    if (!verifiedUser) {
      return res.status(401).send("unauthorized request 2");
    }
    req.user = verifiedUser.dataValues;

    next();
  } catch (err) {
    res.status(400).send("invalid token");
  }
};

const checkRole = (req, res, next) => {
  if (!req.user.isVerify) {
    res.status(401).json({
      message: "access denied",
    });
  }

  next();
};

module.exports = { verifyToken, checkRole };
