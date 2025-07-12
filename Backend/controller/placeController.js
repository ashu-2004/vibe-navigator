const Place = require("../models/place"); // Import your Place model
const fs = require("fs");
const mongoose = require("mongoose");

module.exports.findPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    // console.log("places:", places);
    res.json(places);
  } catch (error) {
    console.error("❌ Error fetching places:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// module.exports.importData = async () => {
//   try {

//     const raw = fs.readFileSync('../Flask/maps_places.json', 'utf-8');  // adjust path if needed
//     const places = JSON.parse(raw);

//     await Place.deleteMany({});  // optional: clear old data
//     await Place.insertMany(places);

//     // console.log("🎉 Imported data to MongoDB!");
//     // process.exit();
//   } catch (err) {
//     console.error("❌ Import error:", err);
//     process.exit(1);
//   }
// }
module.exports.importData = async (req, res) => {
  try {
    const raw = fs.readFileSync("../Flask/maps_places.json", "utf-8"); // adjust path if needed
    const places = JSON.parse(raw);

    await Place.deleteMany({});
    await Place.insertMany(places);

    res.json({ success: true, count: places.length });
  } catch (err) {
    console.error("❌ Import error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
