const express = require("express");
const router = express.Router();

const {
  createAnswerController,
  updateAnswerController,
  deleteAnswerController,
  getAnswerByIdController,
  getAllAnswersByQuestionIdController,
  getCorrectAnswersByQuestionIdController,
} = require("../controllers/answerController");

// Utwórz odpowiedź
router.route("/create").post(createAnswerController);

// Zaktualizuj odpowiedź po ID
router.route("/update/:id").put(updateAnswerController);

// Usuń odpowiedź po ID
router.route("/delete/:id").delete(deleteAnswerController);

// Pobierz odpowiedź po ID
router.route("/:id").get(getAnswerByIdController);

// Pobierz wszystkie odpowiedzi dla danego pytania
router.route("/question/:question_id").get(getAllAnswersByQuestionIdController);

// Pobierz poprawne odpowiedzi dla danego pytania
router
  .route("/question/:question_id/correct")
  .get(getCorrectAnswersByQuestionIdController);

module.exports = router;
