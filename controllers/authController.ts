import bcrpty from "bcrypt";
import { Request, Response } from "express";
import { responseReturn } from "../utils/response";
import { createToken } from "../utils/createToken";

const adminModel = require("../models/adminModel");

class authController {
  admin_login = async (req: Request, res: Response, next: any) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      const match = await bcrpty.compare(password, admin.password);
      if (admin && match) {
        const token = createToken({
          id: admin.id,
          role: admin.role,
        });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        responseReturn(res, 200, "Login successful");
      } else {
        responseReturn(res, 400, {
          error: "Email and/or password not not valid",
        });
      }
    } catch (error: any) {
      responseReturn(res, 500, { error: error.message });
    }
    next();
  };
}

module.exports = new authController();
