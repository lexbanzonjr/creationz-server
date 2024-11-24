import { Request, Response } from "express";
import UserServices from "../services/UserServices";
import { Locals } from "../middlewares/types";
import userModel from "../models/userModel";

class UserController {
  get = async (req: Request, res: Response, next: any) => {
    const { sync, userId } = res.locals as Locals;
    const user = await userModel.get({
      _id: userId,
    });
    if (sync) {
      const { access_token } = user.apiToken;

      await UserServices.sync({ access_token, user });
    }
    res.json({ user });
    next();
  };
}

export default new UserController();
