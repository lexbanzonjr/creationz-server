import { Router } from "express";
import multer from "multer";

import BinaryController from "../controllers/BinaryController";

// Multer setup
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

let router = Router();
router.get("/:_id", BinaryController.get);
router.post("", upload.single("binary"), BinaryController.create);

module.exports = router;
