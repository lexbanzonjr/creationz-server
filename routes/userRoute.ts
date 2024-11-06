import { Router } from "express";
import userController from "../controllers/userController";
import { adminMiddleware } from "./../middlewares/adminMiddleware";

let router = Router();
router.delete("", adminMiddleware, userController.delete);
router.get("", adminMiddleware, userController.list);
router.post("", adminMiddleware, userController.create);

module.exports = router;
