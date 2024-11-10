import { Request, Response } from "express";

class UserController {
  get = async (req: Request, res: Response, next: any) => {
    const { user } = res.locals;
    res.json({ user });
    next();
  };
}

export default new UserController();
