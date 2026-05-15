const rideService = require("../services/ride.service");
const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const pickupCoordinates = await mapService.getAddressCoordinates(pickup);

    console.log(pickupCoordinates);

    const captainInRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      2,
    );

    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");

    captainInRadius.map((captain) => {
      console.log("SENDING TO CAPTAIN ROOM:", captain._id.toString());

      sendMessageToSocketId(captain._id.toString(), {
        event: "new-ride",
        data: rideWithUser,
      });
    });

    return res.status(201).json({
      ride,
      captainInRadius,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);

    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { rideId } = req.body;
  try {
    console.log(
      "[RIDE] Confirming ride - rideId:",
      rideId,
      "captainId:",
      req.captain._id,
    );

    const ride = await rideService.confirmRide({
      rideId,
      captainId: req.captain._id,
    });

    console.log("[RIDE] Ride confirmed - user ID:", ride.user._id.toString());

    sendMessageToSocketId(ride.user._id.toString(), {
      event: "ride-confirmed",
      data: ride,
    });

    console.log(
      "[RIDE] Ride confirmation event sent to user:",
      ride.user._id.toString(),
    );

    return res.status(200).json(ride);
  } catch (err) {
    console.log("[RIDE] Error confirming ride:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { rideId, otp } = req.query;
  try {
    const ride = await rideService.startRide({
      rideId: rideId,
      otp: otp,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user._id.toString(), {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { rideId } = req.body;
  try {
    const ride = await rideService.endRide({
      rideId: rideId,
      captain: req.captain,
    });
    sendMessageToSocketId(ride.user._id.toString(), {
      event: "ride-ended",
      data: ride,
    });

    

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
