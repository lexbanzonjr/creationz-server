import { Router } from "express";
import AuthHandler from "../handlers/AuthHandler";

let router = Router();
router.get("/guest-token", AuthHandler.guestToken);
router.post("/login", AuthHandler.login);
router.post("/refresh-token", AuthHandler.refreshToken);
router.post("/register", AuthHandler.register);

module.exports = router;
