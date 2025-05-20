const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.QUIZ_PORT || 4003;

app.get("/", (req, res) => {
  res.send("Quizz service working ✅");
});

app.listen(PORT, () => console.log(`Quizz service running on ${PORT}`));
