import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authMiddleware as yahooAuthMiddleware } from "../middlewares/yahoo/authMiddleware";
import { tokenMiddleware } from "../middlewares/yahoo/tokenMiddleware";
import AuthController from "../controllers/yahoo/AuthController";
import LeagueController from "../controllers/yahoo/LeagueController";
import TeamController from "../controllers/yahoo/TeamController";
import UserController from "../controllers/yahoo/UserController";

export let router = Router();
router.get("/auth/callback", AuthController.callback);
router.get("/auth/login", authMiddleware, AuthController.login);
router.get(
  "/auth/refresh_token",
  yahooAuthMiddleware,
  AuthController.refreshToken
);

router.get("/user", [yahooAuthMiddleware, tokenMiddleware], UserController.get);
router.get(
  "/user/sync",
  [yahooAuthMiddleware, tokenMiddleware],
  UserController.get_sync
);

router.get(
  "/user/league",
  [yahooAuthMiddleware, tokenMiddleware],
  LeagueController.get
);
router.get(
  "/user/league/sync",
  [yahooAuthMiddleware, tokenMiddleware],
  LeagueController.get_sync
);

router.get(
  "/user/team",
  [yahooAuthMiddleware, tokenMiddleware],
  TeamController.get
);
router.get(
  "/user/team/sync",
  [yahooAuthMiddleware, tokenMiddleware],
  TeamController.get_sync
);

module.exports = router;
