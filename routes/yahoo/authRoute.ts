import { Router } from "express";
import auth from "../../controllers/yahoo/AuthController";
import { authMiddleware } from "./../../middlewares/authMiddleware";
import { authMiddleware as yahooAuthMiddleware } from "./../../middlewares/yahoo/authMiddleware";

namespace Yahoo {
  export let router = Router();
  router.get("/callback", auth.callback);
  router.get("/login", authMiddleware, auth.login);
  router.get("/refresh_token", yahooAuthMiddleware, auth.refreshToken);
}

module.exports = Yahoo.router;
