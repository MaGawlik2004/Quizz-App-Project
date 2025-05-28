const express = require("express");
const router = express.Router();
const levelController = require("../controllers/levelController");

router.post("/", levelController.createLevelController);
router.get("/", levelController.getLevelsController);
router.get("/:id", levelController.getLevelByIdController);
router.get("/name/:name", levelController.getLevelByNameController);
router.put("/:id", levelController.updateLevelController);
router.delete("/:id", levelController.deleteLevelController);

module.exports = router;
