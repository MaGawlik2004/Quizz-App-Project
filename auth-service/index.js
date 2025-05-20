const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.AUTH_PORT || 4001;

app.get("/", (req, res) => {
  res.send("Auth service working ✅");
});

app.listen(PORT, () => console.log(`Auth service running on ${PORT}`));
