import { Router } from "express";
import UserController from "../controllers/UserController";

let router = Router();
router.delete("", UserController.delete);
router.get("", UserController.list);
router.post("", UserController.create);

module.exports = router;
