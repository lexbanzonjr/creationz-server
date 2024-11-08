import { Router } from "express";
import { authMiddleware } from "../../../middlewares/yahoo/authMiddleware";
import basketball from "../../../controllers/yahoo/fantasy/BasketballController";
import { tokenMiddleware } from "../../../middlewares/yahoo/tokenMiddleware";

export let router = Router();
router.get("/roster", [authMiddleware, tokenMiddleware], basketball.roster);
router.get("/team", [authMiddleware, tokenMiddleware], basketball.team);

module.exports = router;
