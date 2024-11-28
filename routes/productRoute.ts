import { Router } from "express";
import ProductController from "../controllers/ProductController";

let router = Router();
router.get("", ProductController.list);
router.delete("", ProductController.delete);
router.post("", ProductController.create);

module.exports = router;
