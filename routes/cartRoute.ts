import { Router } from "express";
import CartHandler from "../handlers/CartHandler";
import { cartMiddleware } from "../middlewares/cartMiddleware";

let router = Router();
router.use(cartMiddleware);
router.post("/", CartHandler.add);
router.get("/", CartHandler.get);

module.exports = router;
