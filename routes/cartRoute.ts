import { Router } from "express";
import CartHandler from "../handlers/CartHandler";
import { cartMiddleware } from "../middlewares/cartMiddleware";

let router = Router();
router.use(cartMiddleware);
router.delete("/", CartHandler.removeItem);
router.post("/", CartHandler.add);
router.get("/", CartHandler.get);
router.get("/subTotal", CartHandler.getSubTotal);

module.exports = router;
