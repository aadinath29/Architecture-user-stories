//importing lib
require("dotenv").config();
const express = require("express");
const geminiRoute = require("./gemini.js");
const cors = require("cors");

//initialize server
const app = express();

//define the data parsing format
app.use(express.json());

// ✅ OPEN CORS FOR ALL
app.use(cors());

//api endpoints
app.get("/", (req, res) => {
  res.json({ msg: "server running on port 5000" });
});

app.use("/a", geminiRoute);

app.listen(5000, () => {
  console.log("running the server on port 5000");
});
