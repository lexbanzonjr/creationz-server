import { Router } from "express";
import UserHandler from "../handlers/UserHandler";

let router = Router();
router.delete("", UserHandler.delete);
router.get("", UserHandler.list);
router.post("", UserHandler.create);

module.exports = router;
