const router = require("express").Router();
import { authMiddleware } from "./../middlewares/authMiddleware";
const authController = require("../controllers/authController");

router.get("/get-user", authMiddleware, authController.get_user);
router.post("/admin-login", authController.admin_login);

module.exports = router;
