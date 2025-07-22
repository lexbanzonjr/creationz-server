import { Router } from "express";
import OrderHandler from "../handlers/OrderHandler";
import { cartMiddleware } from "../middlewares/cartMiddleware";

let router = Router();
router.use(cartMiddleware);
router.post("/", OrderHandler.create);
router.get("/", OrderHandler.list);
router.get("/:order_id", OrderHandler.getById);

module.exports = router;
