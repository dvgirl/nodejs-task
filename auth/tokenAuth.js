const jwt = require("jsonwebtoken");
const { env } = require("process");
const User = require("../models/user-model");

const checkToken = async (req, res, next) => {
    const token = req.headers["x-access-token"] || req.headers["token"] || req.headers.token;
    if (!token) {
      return res.status(403).json({ status: 403 });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRATEKEY);
        req.user = decoded;
        next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          const payload = jwt.decode(token);
          const newToken = jwt.sign({ id: payload.id, email: payload.email },process.env.SECRATEKEY,{ expiresIn: '1h' });
          res.setHeader('token', newToken);
          await User.findOneAndUpdate({_id : req.user._id }, {$set : {token : newToken}})
          return res.status(401).json({ message: 'Token expired. A new token has been issued.', token: newToken });
        }
        return res.status(401).json({ message: 'Invalid token.' });
      }
}

module.exports = checkToken