const jwt = require("jsonwebtoken");
const { env } = require("process");
const User = require("../models/user-model");

const verifysuperAdminToken = async (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["token"] || req.headers.token;
  if (!token) {
    return res.status(403).json({ status: 403 });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRATEKEY);
    req.user = decoded;
    req.body.user = decoded;
    const isadmin = await User.findOne({ _id: req.user._id });
    if (isadmin.role != 2) {
      return res.status(401).json(err);
    }
  } catch (err) {
    return res.status(401).json(err);
  }
  return next();
};

module.exports = verifysuperAdminToken;
