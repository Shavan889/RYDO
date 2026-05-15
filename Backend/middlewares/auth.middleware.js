const userModel = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const captainModel = require("../models/captain.model");
const blackListTokenModel = require("../models/blackListToken.model");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized Token not available" });
  }

  const isBlackListed = await blackListTokenModel.findOne({ token: token });
  // console.log(isBlackListed)

  if (isBlackListed) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    req.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports.authCaptain = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized Token not available",
      });
    }

    const isBlackListed = await blackListTokenModel.findOne({
      token,
    });

    if (isBlackListed) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    const captain = await captainModel.findById(decoded._id);

    console.log("CAPTAIN:", captain);

    if (!captain) {
      return res.status(401).json({
        message: "Captain not found",
      });
    }

    req.captain = captain;

    next();
  } catch (err) {
    console.log(err);

    return res.status(401).json({
      message: err.message,
    });
  }
};
