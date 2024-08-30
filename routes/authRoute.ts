import { Router } from "express";
import { authMiddleware } from "./../middlewares/authMiddleware";
import authController from "../controllers/authController";

let router = Router();
router.get("/get-user", authMiddleware, authController.get_user);
router.post("/admin-login", authController.admin_login);

module.exports = router;
