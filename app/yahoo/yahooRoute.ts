import { Router } from "express";

import { authMiddleware } from "./middlewares/authMiddleware";
import { syncMiddleware } from "./middlewares/syncMiddleware";

import AuthController from "./controllers/AuthController";
import LeagueController from "./controllers/LeagueController";
import TeamController from "./controllers/TeamController";
import UserController from "./controllers/UserController";
import { tokenMiddleware } from "./middlewares/tokenMiddleware";

const all = [syncMiddleware];

export let router = Router();
router.use(authMiddleware);
router.use(tokenMiddleware);
router.get("/auth/callback", AuthController.callback);
router.get("/auth/login", AuthController.login);
router.get("/auth/refresh_token", AuthController.refreshToken);

router.get("/user", all, UserController.get);
router.get("/user/league", all, LeagueController.get);
router.get("/user/league/:league_key", all, LeagueController.get);
router.get("/user/league/:league_key/team", all, TeamController.get);

module.exports = router;
