import { Router } from "express";
import TypeController from "../controllers/TypeController";

let router = Router();
router.get("", TypeController.list);
router.delete("", TypeController.delete);
router.post("", TypeController.create);
router.post("/:type_id/option", TypeController.createOption);

module.exports = router;
