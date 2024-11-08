import { Router } from "express";
import { authMiddleware } from "./../middlewares/authMiddleware";
import AuthController from "../controllers/AuthController";

let router = Router();
router.get("/get-user", authMiddleware, AuthController.get_user);
router.post("/admin-login", AuthController.admin_login);
router.post("/login", AuthController.login);

module.exports = router;
