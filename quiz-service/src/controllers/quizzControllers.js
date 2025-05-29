const quizzModel = require("../models/quizzModel");

const createQuizzController = async (req, res) => {
  try {
    const body = {
      ...req.body,
      user_id: req.userId,
    };

    const newQuizz = await quizzModel.createQuizzModel(body);

    res.status(201).json({
      status: "success",
      message: "Quizz został utworzony",
      quizz: newQuizz,
    });
  } catch (err) {
    console.error("Error in creatingQuizz:", err);

    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas tworzenia quizzu",
      error: err.message,
    });
  }
};

const updateQuizzController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID quizzu musi być liczbą",
      });
    }

    const updatedQuizz = await quizzModel.updateQuizzModel(id, req.body);

    if (!updatedQuizz) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono quizu o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Quizz został zaktualizowany",
      quizz: updatedQuizz,
    });
  } catch (err) {
    console.error("Error in updateQuizz:", err);

    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas aktualizacji quizzu",
      error: err.message,
    });
  }
};

const deleteQuizzController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "Id quizzu musi być liczbą",
      });
    }

    const deleteQuizz = await quizzModel.deleteQuizzModel(id);

    if (!deleteQuizz) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono quizu o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Quizz został usunięty",
      quizz: deleteQuizz,
    });
  } catch (err) {
    console.error("Error in deleteQuizz:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas usuwania quizzu",
      error: err.message,
    });
  }
};

const getQuizzByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID quizzu musi być liczbą",
      });
    }

    const quizz = await quizzModel.getQuizzByIdModel(id);

    if (!quizz) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono quizzu o podanym ID",
      });
    }

    res.status(200).json(quizz);
  } catch (err) {
    console.error("Error getQuizzById:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania quizz",
      error: err.message,
    });
  }
};

const getAllQuizzController = async (req, res) => {
  try {
    const quizzes = await quizzModel.getAllQuizzModel(req.query);

    res.status(200).json({
      status: "success",
      quizzes,
    });
  } catch (err) {
    console.error("Error in getAllQuizz:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania quizów",
      error: err.message,
    });
  }
};

const getAllQuizzByUserController = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      return res.status(400).json({
        status: "error",
        message: "Brakuje ID użytkownika",
      });
    }

    const quizzes = await quizzModel.getAllQuizzByUserModel(user_id);

    res.status(200).json({
      status: "success",
      quizzes,
    });
  } catch (err) {
    console.error("Error in getAllQuizzByUser:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania quizów użytkownika",
      error: err.message,
    });
  }
};

const getFullQuizzByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID quizu musi być liczbą",
      });
    }

    const quizz = await quizzModel.getFullQuizzByIdModel(id);

    if (!quizz) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono quizu o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      quizz,
    });
  } catch (err) {
    console.error("Error in getFullQuizzById:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania pełnych danych quizu",
      error: err.message,
    });
  }
};

const countQuizzesByUserController = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      return res.status(400).json({
        status: "error",
        message: "Brakuje ID użytkownika",
      });
    }

    const count = await quizzModel.countQuizzesByUserModel(user_id);

    res.status(200).json({
      status: "success",
      user_id,
      count,
    });
  } catch (err) {
    console.error("Error in countQuizzesByUser:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas liczenia quizów użytkownika",
      error: err.message,
    });
  }
};

module.exports = {
  createQuizzController,
  updateQuizzController,
  deleteQuizzController,
  getQuizzByIdController,
  getAllQuizzController,
  getAllQuizzByUserController,
  getFullQuizzByIdController,
  countQuizzesByUserController,
};
