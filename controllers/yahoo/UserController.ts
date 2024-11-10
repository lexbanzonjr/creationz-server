import { Request, Response } from "express";
import UserServices from "../../services/yahoo/UserServices";

class UserController {
  get = async (req: Request, res: Response, next: any) => {
    const { user } = res.locals;
    res.json({ user });
    next();
  };

  get_sync = async (req: Request, res: Response, next: any) => {
    const { access_token } = res.locals.user.token;
    const { _id } = res.locals.user;

    const user = await UserServices.sync({ access_token, userId: _id });

    res.send({ user });
    next();
  };
}

export default new UserController();
