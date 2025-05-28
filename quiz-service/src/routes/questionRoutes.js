const express = require("express");
const router = express.Router();

const {
  createQuestionController,
  updateQuestionController,
  deleteQuestionController,
  getAllQuestionByQuizzIdController,
  getQuestionByIdController,
  getQuestionsWithAnswersByQuizIdController,
} = require("../controllers/questionController");

// Utwórz nowe pytanie
router.route("/create").post(createQuestionController);

// Zaktualizuj pytanie po ID
router.route("/update/:id").put(updateQuestionController);

// Usuń pytanie po ID
router.route("/delete/:id").delete(deleteQuestionController);

// Pobierz jedno pytanie po ID
router.route("/:id").get(getQuestionByIdController);

// Pobierz wszystkie pytania dla danego quizu
router.route("/quiz/:quizz_id").get(getAllQuestionByQuizzIdController);

// Pobierz pytania z odpowiedziami dla danego quizu
router
  .route("/quiz/:quizz_id/full")
  .get(getQuestionsWithAnswersByQuizIdController);

module.exports = router;
