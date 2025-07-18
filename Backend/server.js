const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = 8080;

app.use(
  cors({
    origin: "https://vibe-navigator-2.onrender.com/",
    credentials: true,
  })
);

app.use(bodyParser.json());

const places = require("./routes/placeRoutes.js");
app.use("/api", places);

app.listen(port, () => {
  console.log(`Server is running`);
});
