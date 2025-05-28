const categoryModel = require("../models/categoriesModel");

const createCategoryController = async (req, res) => {
  try {
    const newCantegory = await categoryModel.createCategoryModel(req.body);
    res.status(201).json({
      status: "success",
      message: "Category został utworzony",
      category: newCantegory,
    });
  } catch (err) {
    console.error("Error in creatingCategory:", err);

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

const updateCategoryController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID category musi być liczbą",
      });
    }

    const updatedCategory = await categoryModel.updateCategoryModel(
      id,
      req.body
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono category o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Category został zaktualizowany",
      category: updatedCategory,
    });
  } catch (err) {
    console.error("Error in updateCategory:", err);

    if (err.message.includes("Błąd walidacji")) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas aktualizacji category",
      error: err.message,
    });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID category musi być liczbą",
      });
    }

    const deleteCategory = await categoryModel.deleteCategoryModel(id);

    if (!deleteCategory) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono cateogry o podanym ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Category został usunięty",
      category: deleteCategory,
    });
  } catch (err) {
    console.error("Error in deleteingCateogry:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas usuwania category",
      error: err.message,
    });
  }
};

const getCategoryByIdController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "ID category musi być liczbą",
      });
    }

    const cateogry = await categoryModel.getCategoryByIdModel(id);

    if (!cateogry) {
      return res.status(404).json({
        status: "error",
        message: "Nie znaleziono category o podanym ID",
      });
    }

    res.status(200).json(cateogry);
  } catch (err) {
    console.error("Error getQuizzById:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania category",
      error: err.message,
    });
  }
};

const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategoriesModel(req.query);

    res.status(200).json({
      status: "success",
      categories,
    });
  } catch (err) {
    console.error("Error in getAllCategories:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania categories",
      error: err.message,
    });
  }
};

const getCategoryByNameController = async (req, res) => {
  try {
    const name = req.params.name;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Brakuje ID użytkownika",
      });
    }

    const category = await categoryModel.getCategoryByNameModel(name);

    res.status(200).json({
      status: "success",
      category,
    });
  } catch (err) {
    console.error("Error in getCategoryByName:", err);
    res.status(500).json({
      status: "error",
      message: "Wystąpił błąd podczas pobierania category",
      error: err.message,
    });
  }
};

module.exports = {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getCategoryByIdController,
  getAllCategoriesController,
  getCategoryByNameController,
};
