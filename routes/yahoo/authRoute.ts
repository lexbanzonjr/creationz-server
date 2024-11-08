import { Router } from "express";
import auth from "../../controllers/yahoo/authController";
import { authMiddleware } from "./../../middlewares/authMiddleware";
import { authMiddleware as yahooAuthMiddleware } from "./../../middlewares/yahoo/authMiddleware";

namespace Yahoo {
  export let router = Router();
  router.get("/login", authMiddleware, auth.login);
  router.get("/callback", auth.callback);
  router.get("/refresh_token", yahooAuthMiddleware, auth.refreshToken);
}

module.exports = Yahoo.router;
