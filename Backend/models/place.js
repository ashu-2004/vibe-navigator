const mongoose = require("../config/db");

const placeSchema = new mongoose.Schema({
  city: String,
  category: String,
  name: String,
  reviews: [String],
  source: String
});

const Place = mongoose.model("Place", placeSchema);
module.exports = Place;
