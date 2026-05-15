const rideModel = require("../models/ride.model");
const mapsService = require("./maps.service");
const crypto = require("crypto");
const { sendMessageToSocketId } = require("../socket");

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("pickup and destination are required");
  }
  const distanceTime = await mapsService.getDistanceTime(pickup, destination);

  const basefare = {
    moto: 10,
    auto: 18,
    car: 25,
  };

  const perKmRate = {
    moto: 5,
    auto: 8,
    car: 12,
  };

  const perMinRate = {
    moto: 1,
    auto: 1.6,
    car: 2.2,
  };
  const fare = {
    auto: Math.round(
      basefare.auto +
        (distanceTime.distance.value / 1000) * perKmRate.auto +
        (distanceTime.duration.value / 60) * perMinRate.auto,
    ),
    moto: Math.round(
      basefare.moto +
        (distanceTime.distance.value / 1000) * perKmRate.moto +
        (distanceTime.duration.value / 60) * perMinRate.moto,
    ),
    car: Math.round(
      basefare.car +
        (distanceTime.distance.value / 1000) * perKmRate.car +
        (distanceTime.duration.value / 60) * perMinRate.car,
    ),
  };
  return fare;
}

module.exports.getFare = getFare;
function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
}

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);

  const ride = rideModel.create({
    user,
    pickup,
    destination,
    otp: getOtp(4),
    fare: fare[vehicleType],
  });

  return ride;
};

module.exports.confirmRide = async ({ rideId, captainId }) => {
  if (!rideId) {
    throw new Error("rideId is required");
  }

  if (!captainId) {
    throw new Error("captainId is required");
  }

  await rideModel.findByIdAndUpdate(rideId, {
    status: "accepted",
    captain: captainId,
  });

  const ride = await rideModel
    .findById(rideId)
    .populate("user")
    .populate("captain")
    .select("+otp");

  console.log("USER SOCKET ID:", ride.user.socketId);

  if (!ride) {
    throw new Error("Ride not found");
  }

  return ride;
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId) {
    throw new Error("rideId is required");
  }
  if (!otp) {
    throw new Error("otp is required");
  }
  if (!captain) {
    throw new Error("captain is required");
  }
  const ride = await rideModel
    .findById(rideId)
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }
  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  const updatedRide = await rideModel
    .findByIdAndUpdate(
      rideId,
      {
        status: "ongoing",
      },
      { new: true },
    )
    .populate("captain")
    .populate("user");

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-started",
    data: updatedRide,
  });

  return updatedRide;
};

module.exports.endRide = async ({ rideId, captain }) => {
  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("captain")
    .select("+otp");

  if (!rideId) {
    throw new Error("rideId is required");
  }
  if (!captain) {
    throw new Error("captain is required");
  }

  if (!ride) {
    throw new Error("Ride not found or you are not the captain of this ride");
  }
  if (ride.status !== "ongoing") {
    throw new Error("Ride is not ongoing");
  }

  await rideModel.findByIdAndUpdate(rideId, {
    status: "completed",
  });

  return ride;
};
