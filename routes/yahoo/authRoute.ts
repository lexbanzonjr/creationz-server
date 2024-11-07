import { Router } from "express";
import auth from "../../controllers/yahoo/authController";
import { authMiddleware } from "./../../middlewares/authMiddleware";

namespace Yahoo {
  export let router = Router();
  router.get("/login", authMiddleware, auth.login);
  router.get("/callback", auth.callback);
}

module.exports = Yahoo.router;
