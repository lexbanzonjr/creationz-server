import { Router } from "express";
import AuthController from "../controllers/AuthController";

let router = Router();
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

module.exports = router;
