import { Router } from "express";
import AuthHandler from "../handlers/AuthHandler";

let router = Router();
router.post("/login", AuthHandler.login);
router.post("/register", AuthHandler.register);

module.exports = router;
