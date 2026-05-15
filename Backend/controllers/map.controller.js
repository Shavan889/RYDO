const { validationResult } = require("express-validator");
const mapsService = require("../services/maps.service");

module.exports.getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { address } = req.query;
  try {
    const coordinates = await mapsService.getAddressCoordinates(address);
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(404).json({
      message: "Coordinates not found",
    });
  }
};

module.exports.getDistanceTime = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { origin, destination } = req.query;
    const distanceTime = await mapsService.getDistanceTime(origin, destination);

    res.status(200).json(distanceTime);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Location not found" });
  }
};

module.exports.getCompleteSuggestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { input } = req.query;

    const suggestions = await mapsService.getSuggestions(input);
    res.status(200).json(suggestions);
  } catch (err) {
    console.error("[SUGGESTION CONTROLLER] Error:", err.message);
    console.error("[SUGGESTION CONTROLLER] Full error:", err);
    res.status(404).json({ message: "Location not found", error: err.message });
  }
};
