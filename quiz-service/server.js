const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { notFound, errorHandler } = require("./src/middlewares/errorMiddleawre");

const quizzRoutes = require("./src/routes/quizzRoutes");
const questionRoutes = require("./src/routes/questionRoutes");
const answerRoutes = require("./src/routes/answerRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Quizz service working ✅");
});

app.use("/quizz", quizzRoutes);
app.use("/question", questionRoutes);
app.use("/answer", answerRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.QUIZ_PORT || 4003;

app.listen(PORT, () => console.log(`Quizz service running on ${PORT}`));
