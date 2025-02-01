import { Router } from "express";
import multer from "multer";

import BinaryController from "../controllers/BinaryController";

let router = Router();
router.get("/:_id", BinaryController.get);

module.exports = router;
