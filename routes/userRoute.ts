import { Router } from "express";
import UserController from "../controllers/UserController";
import { adminMiddleware } from "./../middlewares/adminMiddleware";

let router = Router();
router.delete("", adminMiddleware, UserController.delete);
router.get("", adminMiddleware, UserController.list);
router.post("", adminMiddleware, UserController.create);

module.exports = router;
