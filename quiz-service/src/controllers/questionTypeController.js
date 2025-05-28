const questrionTypeModel = require("../models/questionTypeModel");

const createQuestionTypeController = async (req, res) => {
  try {
    const newQuestionType = await questrionTypeModel.createQuestionTypeModel(
      req.body
    );
    res.status(201).json({
      status: "success",
      message: "QuestionType został utworzony",
      questionType: newQuestionType,
    });
  } catch (err) {
    console.error("Error in creatingQuestionType:", err);

    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas tworzenia question type",
      error: err.message,
    });
  }
};

const updateQuestionTypeController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID question type musi być liczbą",
      });
    }

    const updateQuestionType = await questrionTypeModel.updateQuestionTypeModel(
      id,
      req.body
    );

    if (!updateQuestionType) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono question type o podanym ID",
      });
    }

    res.status(200).json({
      status: "error",
      message: "QuestionType został zaktualizowany",
      questionType: updateQuestionType,
    });
  } catch (err) {
    console.error("Error in updateQuestionType:", err);

    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas aktualizacji question type",
      error: err.message,
    });
  }
};

const deleteQuestionTypeController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID question type musi być liczbą",
      });
    }

    const deleteQuestionType = await questrionTypeModel.deleteQuestionTypeModel(
      id
    );

    if (!deleteQuestionType) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono question type o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Questiopn type został usunięty",
      questrionType: deleteQuestionType,
    });
  } catch (err) {
    console.error("Error in deleteQuestionType", err);

    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas usuwania question type",
      error: err.message,
    });
  }
};

const getQuestionTypeByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID question type musi być liczbą",
      });
    }

    const questionType = await questrionTypeModel.getQuestionTypeByIdModel(id);

    if (!questionType) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono question type o podanym ID",
      });
    }

    res.status(200).json(questionType);
  } catch (err) {
    console.error("Error in getQuestionTypeById:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania question type",
      error: err.message,
    });
  }
};

const getQuestionTypesController = async (req, res) => {
  try {
    const questionTypes = await questrionTypeModel.getAllQuestionTypesModel(
      req.query
    );

    res.status(200).json({
      status: "success",
      questionTypes,
    });
  } catch (err) {
    console.error("Error in getAllQuestionTypes", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania question types",
      error: err.message,
    });
  }
};

const getQuestionTypeByNameController = async (req, res) => {
  try {
    const name = req.params.name;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Brakuje ID question type",
      });
    }

    const questionType = await questrionTypeModel.getQuestionTypeByNameModel(
      name
    );

    res.status(200).json({
      status: "success",
      questionType,
    });
  } catch (err) {
    console.error("Error in getQeustionTypeByName", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania queston type",
      error: err.message,
    });
  }
};

module.exports = {
  createQuestionTypeController,
  updateQuestionTypeController,
  deleteQuestionTypeController,
  getQuestionTypeByIdController,
  getQuestionTypesController,
  getQuestionTypeByNameController,
};
