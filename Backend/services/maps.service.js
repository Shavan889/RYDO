const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinates = async (address) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API,
        },
      },
    );

    if (response.data.results.length === 0) {
      throw new Error("Address not found");
    }

    const location = response.data.results[0].geometry.location;

    return {
      lat: location.lat,
      lng: location.lng,
    };
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw error;
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("origin and destination are required");
  }

  try {
    // Step 1: Convert origin and destination into coordinates
    const originCoords =
      await module.exports.getAddressCoordinates(origin);

    const destinationCoords =
      await module.exports.getAddressCoordinates(destination);

    // Step 2: Call Routes API
    const response = await axios.post(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        origin: {
          location: {
            latLng: {
              latitude: originCoords.lat,
              longitude: originCoords.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destinationCoords.lat,
              longitude: destinationCoords.lng,
            },
          },
        },
        travelMode: "DRIVE",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key":
            process.env.GOOGLE_MAPS_API,

          // VERY IMPORTANT
          "X-Goog-FieldMask":
            "routes.distanceMeters,routes.duration",
        },
      },
    );

    const route = response.data.routes[0];

    if (!route) {
      throw new Error("No route found");
    }

    return {
      distance: {
        text: `${(route.distanceMeters / 1000).toFixed(1)} km`,
        value: route.distanceMeters,
      },

      duration: {
        text: `${Math.ceil(
          parseInt(route.duration.replace("s", "")) / 60,
        )} mins`,
        value: parseInt(
          route.duration.replace("s", ""),
        ),
      },
    };
  } catch (error) {
    console.error(
      "Error fetching distance and time:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

module.exports.getSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${process.env.GOOGLE_MAPS_API}`;
  try {
    const response = await axios.get(url);
    console.log("[GOOGLE MAPS API] Status:", response.data.status);
    console.log("[GOOGLE MAPS API] Response:", response.data);
    if (response.data.status === "OK") {
      return response.data.predictions;
    } else {
      throw new Error(`Google Maps API returned status: ${response.data.status} - ${response.data.error_message || ""}`);
    }
  } catch (error) {
    console.error("[MAPS SERVICE] Error fetching suggestions:", error.message);
    throw error;
  }
};

module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lat, lng], radius / 1000000],
      },
    },
  });
  return captains;
};
