import bcrpty from "bcrypt";
import { Request, Response } from "express";
import { responseReturn } from "../utils/response";
import { createToken } from "../utils/createToken";
import { RestError } from "../utils/RestError";

import adminModel from "../models/adminModel";
import userModel from "../models/userModel";
import { IAccessTokenData } from "../utils/types";
import { now } from "mongoose";

class authController {
  admin_login = async (req: Request, res: Response, next: any) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      if (!admin) {
        throw new RestError("Email and/or password not not valid", {
          status: 400,
        });
      }
      const match = await bcrpty.compare(password, admin.password);
      if (!match) {
        throw new RestError("Email and/or password not not valid", {
          status: 400,
        });
      }

      const token = createToken({
        id: admin.id,
        role: admin.role,
      } as IAccessTokenData);
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      responseReturn(res, 200, {
        message: "Login successful",
        accessToken: token,
      });
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };

  get_user = async (req: Request, res: Response, next: any) => {
    const { id, role } = res.locals;
    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else {
        console.log("seller info");
      }
    } catch (error: any) {
      console.error(error.message);
    }
    next();
  };

  login = async (req: Request, res: Response, next: any) => {
    const { name, password } = req.body;
    try {
      const user = await userModel.findOne({ name, password });
      if (!user) {
        throw new Error("User not found");
      }

      const token = createToken({
        id: user._id,
        role: user.role,
      } as unknown as IAccessTokenData);
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      user.lastLogIn = now();
      user.save();
      responseReturn(res, 200, { id: user._id, role: user.role });
    } catch (error: any) {
      responseReturn(res, 500, { error: error.message });
    }
    next();
  };
}

export default new authController();
