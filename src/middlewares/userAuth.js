const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("please login");
    }

    const decodedObj = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ _id: decodedObj._id });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
