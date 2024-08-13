import { Request, Response } from "express";
import { responseReturn } from "../utils/response";

const adminModel = require("../models/adminModel");

class authController {
  admin_login = async (req: Request, res: Response, next: any) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      if (admin) {
        res.json(admin);
      } else {
        responseReturn(res, 400, { error: "Email not found" });
      }
    } catch (error: any) {
      responseReturn(res, 500, { error: error.message });
    }
    next();
  };
}

module.exports = new authController();
