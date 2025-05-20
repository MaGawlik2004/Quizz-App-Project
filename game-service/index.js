const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.GAME_PORT || 4002;

app.get("/", (req, res) => {
  res.send("Game service working ✅");
});

app.listen(PORT, () => console.log(`Game service running on ${PORT}`));
