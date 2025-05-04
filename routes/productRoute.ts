import { Router } from "express";
import ProductHandler from "../handlers/ProductHandler";

let router = Router();
router.get("", ProductHandler.list);
router.delete("", ProductHandler.delete);
router.post("", ProductHandler.create);
router.put("", ProductHandler.update);

module.exports = router;
