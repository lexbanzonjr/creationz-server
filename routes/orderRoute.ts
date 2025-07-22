import { Router } from "express";
import OrderHandler from "../handlers/OrderHandler";

let router = Router();
router.post("/", OrderHandler.create);
router.get("/", OrderHandler.list);
router.get("/:order_id", OrderHandler.getById);

module.exports = router;
