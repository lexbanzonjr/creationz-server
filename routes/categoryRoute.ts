import { Router } from "express";
import CatgeoryController from "../controllers/CategoryController";
import CategoryController from "../controllers/CategoryController";

let router = Router();
router.get("", CategoryController.list);
router.delete("", CatgeoryController.delete);
router.post("", CatgeoryController.create);

module.exports = router;
