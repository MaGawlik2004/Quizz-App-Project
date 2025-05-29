const express = require("express");
const router = express.Router();

const {
  createQuizzController,
  updateQuizzController,
  deleteQuizzController,
  getQuizzByIdController,
  getAllQuizzController,
  getAllQuizzByUserController,
  getFullQuizzByIdController,
  countQuizzesByUserController,
} = require("../controllers/quizzControllers");

const {
  extractUserIdFromToken,
} = require("../middlewares/extractUserIdFromToken");

// Pobierz wszystkie quizy
router.route("/").get(getAllQuizzController);

// Utwórz nowy quiz
router.route("/create").post(extractUserIdFromToken, createQuizzController);

// Zaktualizuj quiz po ID
router.route("/update/:id").put(updateQuizzController);

// Usuń quiz po ID
router.route("/delete/:id").delete(deleteQuizzController);

// Pobierz wszystkie quizy użytkownika po jego ID
router.route("/user").get(extractUserIdFromToken, getAllQuizzByUserController);

// Policz ile quizów stworzył użytkownik
router
  .route("/count")
  .get(extractUserIdFromToken, countQuizzesByUserController);

// Pobierz quiz po ID
router.route("/:id").get(getQuizzByIdController);

// Pobierz pełne dane quizu (np. z pytaniami i odpowiedziami)
router.route("/full/:id").get(getFullQuizzByIdController);

module.exports = router;
