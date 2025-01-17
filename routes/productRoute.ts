import { Router } from "express";
import ProductController from "../controllers/ProductController";

let router = Router();
router.get("", ProductController.list);
router.delete("", ProductController.delete);
router.post("", ProductController.create);
router.put("", ProductController.update);

module.exports = router;
