import { Request, Response } from "express";
import { responseReturn } from "../utils/response";
import { RestError } from "../utils/RestError";

import userModel from "../models/userModel";

class userController {
  create = async (req: Request, res: Response, next: any) => {
    const { name, email, password, role } = req.body;
    try {
      if (await userModel.exists({ name })) {
        throw new RestError("Username already exist", {
          status: 400,
        });
      }

      const user = new userModel({ name, email, password, role });
      await user.save();

      responseReturn(res, 200, { id: user._id });
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };

  delete = async (req: Request, res: Response, next: any) => {
    const { name } = req.body;
    try {
      await userModel.deleteOne({ name });

      responseReturn(res, 200);
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };

  list = async (req: Request, res: Response, next: any) => {
    try {
      responseReturn(res, 200, { users: await userModel.find() });
    } catch (error: any) {
      responseReturn(res, error.status || 500, { error: error.message });
    }
    next();
  };
}

export default new userController();
