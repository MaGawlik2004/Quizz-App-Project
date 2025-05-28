const express = require("express");
const router = express.Router();
const questionTypeController = require("../controllers/questionTypeController");

router.post("/", questionTypeController.createQuestionTypeController);
router.get("/", questionTypeController.getAllQuestionTypesController);
router.get("/:id", questionTypeController.getQuestionTypeByIdController);
router.get(
  "/name/:name",
  questionTypeController.getQuestionTypeByNameController
);
router.put("/:id", questionTypeController.updateQuestionTypeController);
router.delete("/:id", questionTypeController.deleteQuestionTypeController);

module.exports = router;
