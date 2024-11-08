import { Router } from "express";
import { authMiddleware } from "../../middlewares/yahoo/authMiddleware";
import { tokenMiddleware } from "../../middlewares/yahoo/tokenMiddleware";
import FantasyController from "../../controllers/yahoo/FantasyController";

export let router = Router();
router.get(
  "/league",
  [authMiddleware, tokenMiddleware],
  FantasyController.league
);

module.exports = router;
