const express = require("express");
const router = express.Router();
const placesController = require("../controller/placeController.js");

// Get all places
router.get("/places", placesController.findPlaces);
router.post("/import-data", placesController.importData);

module.exports = router;
