const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoriesController");

router.post("/", categoryController.createCategoryController);
router.get("/", categoryController.getAllCategoriesController);
router.get("/:id", categoryController.getCategoryByIdController);
router.get("/name/:name", categoryController.getCategoryByNameController);
router.put("/:id", categoryController.updateCategoryController);
router.delete("/:id", categoryController.deleteCategoryController);

module.exports = router;
