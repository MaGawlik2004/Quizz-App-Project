const answerModel = require("../models/answerModel");

const createAnswerController = async (req, res) => {
  try {
    const newAnswer = await answerModel.createAnswerModel(req.body);
    res.status(201).json({
      status: "success",
      message: "Answer został utworzony",
      answer: newAnswer,
    });
  } catch (err) {
    console.error("Error in creatingAnswer", err);

    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas tworzenia answer",
    });
  }
};

const updateAnswerController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID answer musi być liczbą",
      });
    }

    const updatedAnswer = await answerModel.updateAnswerModel(id, req.body);

    if (!updatedAnswer) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono answer o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Answer został zaktualizowany",
      answer: updatedAnswer,
    });
  } catch (err) {
    console.error("Error in updateAnswer:", err);

    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas aktualizacji answer",
      error: err.message,
    });
  }
};

const deleteAnswerController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID answer musi być liczbą",
      });
    }

    const deleteAnswer = await answerModel.deleteAnswerModel(id);

    if (!deleteAnswer) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono answer o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Answer został usunięty",
      answer: deleteAnswer,
    });
  } catch (err) {
    console.error("Error in deleteAnswer:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas usuwania answer",
      error: err.message,
    });
  }
};

const getAnswerByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID answer musi być liczbą",
      });
    }

    const answer = await answerModel.getAnswerByIdModel(id);

    if (!answer) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono answer o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      answer,
    });
  } catch (err) {
    console.error("Error in getAnswerById:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania answer",
      error: err.message,
    });
  }
};

const getAllAnswersByQuestionIdController = async (req, res) => {
  try {
    const question_id = parseInt(req.params.question_id);

    if (isNaN(question_id)) {
      return res.status(400).json({
        status: "error",
        message: "Brakuje poprawnego ID question",
      });
    }

    const answers = await answerModel.getAllAnswersByQuestionIdModel(
      question_id
    );

    res.status(200).json({
      status: "success",
      answers,
    });
  } catch (err) {
    console.error("Error in getAllAnswersByQuestionId:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania odpowiedzi",
      error: err.message,
    });
  }
};

const getCorrectAnswersByQuestionIdController = async (req, res) => {
  try {
    const question_id = parseInt(req.params.question_id);

    if (isNaN(question_id)) {
      return res.status(400).json({
        status: "error",
        message: "ID question musi być liczbą",
      });
    }

    const correctAnswers = await answerModel.getCorrectAnswersByQuestionIdModel(
      question_id
    );

    if (!correctAnswers || correctAnswers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Brak poprawnych odpowiedzi dla podanego pytania",
      });
    }

    res.status(200).json({
      status: "success",
      correctAnswers,
    });
  } catch (err) {
    console.error("Error in getCorrectAnswersByQuestionId:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania poprawnych odpowiedzi",
      error: err.message,
    });
  }
};

module.exports = {
  createAnswerController,
  updateAnswerController,
  deleteAnswerController,
  getAnswerByIdController,
  getAllAnswersByQuestionIdController,
  getCorrectAnswersByQuestionIdController,
};
