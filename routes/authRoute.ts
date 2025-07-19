import { Router } from "express";
import AuthHandler from "../handlers/AuthHandler";

let router = Router();
router.get("/guest-token", AuthHandler.guestToken);
router.get("/refresh-token", AuthHandler.refreshToken);
router.post("/login", AuthHandler.login);
router.post("/register", AuthHandler.register);

module.exports = router;
