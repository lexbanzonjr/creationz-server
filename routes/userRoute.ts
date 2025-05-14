import { Router } from "express";
import CartHandler from "../handlers/CartHandler";
import UserHandler from "../handlers/UserHandler";

let router = Router();
router.delete("", UserHandler.delete);
router.get("", UserHandler.list);
router.post("", UserHandler.create);
router.post("/cart", CartHandler.add);
router.get("/cart", CartHandler.get);
router.get("/cart/subTotal", CartHandler.getSubtotal);

module.exports = router;
