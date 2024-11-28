import { Router } from "express";
import CategoryController from "../controllers/CategoryController";

let router = Router();
router.get("", CategoryController.list);
router.delete("", CategoryController.delete);
router.post("", CategoryController.create);

module.exports = router;
