import { Router } from "express";
import userController from "../controllers/userController";

let router = Router();
router.delete("", userController.delete);
router.get("", userController.list);
router.post("", userController.create);

module.exports = router;
