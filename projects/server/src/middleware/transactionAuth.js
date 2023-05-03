const jwt = require("jsonwebtoken");
const secret = process.env.secret_key;

const verifyUser = (req, res, next) => {
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
    req.user = verifiedUser;
    next();
  } catch (err) {
    res.status(400).send("invalid token");
  }
};

const checkUserVerified = async (req, res, next) => {
  if (req.user.isVerify) {
    return next();
  }
  return res.status(401).send("unauthorized! / access denied");
};

module.exports = { verifyUser, checkUserVerified };
