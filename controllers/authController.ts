import { Request, Response } from "express";

const adminModel = require("../models/adminModel");

class authController {
  admin_login = async (req: Request, res: Response, next: any) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      console.log(admin);
      res.json({});
    } catch (err) {}
    next();
  };
}

module.exports = new authController();
