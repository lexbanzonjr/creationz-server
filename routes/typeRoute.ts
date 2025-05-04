import { Router } from "express";
import TypeHandler from "../handlers/TypeHandler";

let router = Router();
router.get("", TypeHandler.list);
router.delete("", TypeHandler.delete);
router.post("", TypeHandler.create);
router.post("/:type_id/option", TypeHandler.createOption);

module.exports = router;
