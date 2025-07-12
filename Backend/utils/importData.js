const fs = require('fs');
const Place = require('./models/Place');

async function importData() {
  const raw = fs.readFileSync('../Flask/scraped_places.json', 'utf-8');
  const places = JSON.parse(raw);

  await Place.deleteMany({});  // optional: clear old data
  await Place.insertMany(places);

  console.log("🎉 Imported data to MongoDB!");
  process.exit();
}

importData().catch(err => {
  console.error("❌ Import error:", err);
});
