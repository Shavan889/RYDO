const blackListTokenModel = require("../models/blackListToken.model");
const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.services");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyexists = await captainModel.findOne({ email });

    if (isCaptainAlreadyexists) {
      return res.status(409).json({
        message: "Captain already exists",
      });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });

    const token = captain.generateAuthToken();

    return res.status(201).json({
      token,
      captain,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const token = captain.generateAuthToken();

    res.cookie("captainToken", token);

    return res.status(200).json({
      token,
      captain,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getCaptainProfile = async (req, res, next) => {
  return res.status(200).json({
    captain: req.captain,
  });
};

module.exports.logoutCaptain = async (req, res, next) => {
  try {
    res.clearCookie("captainToken");

    const token =
      req.cookies.captainToken || req.headers.authorization?.split(" ")[1];

    await blackListTokenModel.create({ token });

    return res.status(200).json({
      message: "Logout Successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: err.message,
    });
  }
};
