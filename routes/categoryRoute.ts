import { Router } from "express";
import CategoryHandler from "../handlers/CategoryHandler";

let router = Router();
router.get("", CategoryHandler.list);
router.delete("", CategoryHandler.delete);
router.post("", CategoryHandler.create);
router.put("", CategoryHandler.update);

module.exports = router;
