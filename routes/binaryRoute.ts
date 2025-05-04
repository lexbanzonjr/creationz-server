import { Router } from "express";
import multer from "multer";

import BinaryHandler from "../handlers/BinaryHandler";

// Multer setup
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

let router = Router();
router.get("/:_id", BinaryHandler.get);
router.post("", upload.single("binary"), BinaryHandler.create);

module.exports = router;
