const levelModel = require("../models/levelModel");

const createLevelController = async (req, res) => {
  try {
    const newLevel = await levelModel.createLevelModel(req.body);

    res.status(201).json({
      status: "success",
      message: "Level został utworzony",
      level: newLevel,
    });
  } catch (err) {
    console.error("Error in creating level:", err);

    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas tworzenia category",
      error: err.message,
    });
  }
};

const updateLevelController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID level musi być liczbą",
      });
    }

    const updatedLevel = await levelModel.updateLevelModel(id, req.body);

    if (!updatedLevel) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono level o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Level został zaktualizowany",
      level: updatedLevel,
    });
  } catch (err) {
    console.error("Error in updateLevel:", err);

    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Wystąpił błą podczas aktualizacji levelu",
      error: err.message,
    });
  }
};

const deleteLevelController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID levelu musi być liczbą",
      });
    }

    const deletedLevel = await levelModel.deleteLevelModel(id);
    if (!deletedLevel) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono levelu o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Level został usunięty",
    });
  } catch (err) {
    console.error("Error in deletingLevel:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas usuwania levelu",
      error: err.message,
    });
  }
};

const getLevelByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID levelu musi być liczbą",
      });
    }

    const level = await levelModel.getLevelByIdModel(id);

    if (!level) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono levelu o podanym ID",
      });
    }

    res.status(200).json(level);
  } catch (err) {
    console.error("Error getLevelById:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania cateogry",
      error: err.message,
    });
  }
};

const getLevelsController = async (req, res) => {
  try {
    const levels = await levelModel.getAllLevelsModel(req.query);

    res.status(200).json({
      status: "success",
      levels,
    });
  } catch (err) {
    console.error("Error in getAllLevels:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania categories",
      error: err.message,
    });
  }
};

const getLevelByNameController = async (req, res) => {
  try {
    const name = req.params.name;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Brakuje ID użytkownika",
      });
    }

    const level = await levelModel.getLevelByNameModel(name);

    res.status(200).json({
      status: "success",
      level,
    });
  } catch (err) {
    console.error("Error in getLevelByName:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania levelu",
      error: err.message,
    });
  }
};

module.exports = {
  createLevelController,
  updateLevelController,
  deleteLevelController,
  getLevelByIdController,
  getLevelsController,
  getLevelByNameController,
};
