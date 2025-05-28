const questionModel = require("../models/questionModel");

const createQuestionController = async (req, res) => {
  try {
    const newQuestion = await questionModel.createQuestionModel(req.body);
    res.status(201).json({
      status: "success",
      message: "Question został utworzony",
      question: newQuestion,
    });
  } catch (err) {
    console.error("Error in creatingQuestion:", err);
    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas tworzenia question",
      error: err.message,
    });
  }
};

const updateQuestionController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID question musi byc liczbą",
      });
    }

    const updatedQuestion = await questionModel.updateQuestionModel(
      id,
      req.body
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono question o podnaym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Question został zaktualizowany",
      question: updatedQuestion,
    });
  } catch (err) {
    console.error("Error in updateQuestion:", err);

    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas aktualizacji question",
      error: err.message,
    });
  }
};

const deleteQuestionController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID question musi byc liczbą",
      });
    }

    const deleteQuestion = await questionModel.deleteQuestionModel(id);

    if (!deleteQuestion) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono question o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Question został usunięty",
      question: deleteQuestion,
    });
  } catch (err) {
    console.error("Error in deleteQuestion:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas usuwania question",
      error: err.message,
    });
  }
};

const getAllQuestionByQuizzIdController = async (req, res) => {
  try {
    const quizz_id = req.params.quizz_id;

    if (!quizz_id) {
      return res.status(400).json({
        status: "error",
        message: "Brakuje ID quizzu",
      });
    }

    const questions = await questionModel.getAllQuestionByQuizzIdModel(
      quizz_id
    );

    res.status(200).json({
      status: "success",
      questions,
    });
  } catch (err) {
    console.error("Error in getAllQuestionByQuizz", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania questions",
      error: err.message,
    });
  }
};

const getQuestionByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID question musi być liczbą",
      });
    }

    const question = await questionModel.getQuestionByIdModel(id);

    if (!question) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono question o podanym ID",
      });
    }

    res.status(200).json(question);
  } catch (err) {
    console.error("Error getQuestionById:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania question",
      error: err.message,
    });
  }
};

const getQuestionsWithAnswersByQuizIdController = async (req, res) => {
  try {
    const quizz_id = parseInt(req.params.quizz_id);

    if (isNaN(quizz_id)) {
      return res.status(400).json({
        status: "error",
        message: "ID quizzu musi być liczbą",
      });
    }

    const questionsWithAnswers =
      await questionModel.getQuestionsWithAnswersByQuizIdModel(quizz_id);

    if (!questionsWithAnswers || questionsWithAnswers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Brak pytań z odpowiedziami dla podanego quizzu",
      });
    }

    res.status(200).json({
      status: "success",
      questions: questionsWithAnswers,
    });
  } catch (err) {
    console.error("Error in getQuestionsWithAnswersByQuizId:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania pytań i odpowiedzi",
      error: err.message,
    });
  }
};

module.exports = {
  createQuestionController,
  updateQuestionController,
  deleteQuestionController,
  getAllQuestionByQuizzIdController,
  getQuestionByIdController,
  getQuestionsWithAnswersByQuizIdController,
};
