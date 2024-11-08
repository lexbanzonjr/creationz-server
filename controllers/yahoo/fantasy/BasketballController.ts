import { Request, Response } from "express";
import BasketballServices from "../../../services/yahoo/fantasy/BasketballServices";

export class BasketballController {
  team = async (req: Request, res: Response, next: any) => {
    try {
      res.json(
        await BasketballServices.team(res.locals.user.token.access_token)
      );
    } catch (error: any) {
      res.send(error);
    }
    next();
  };
}

export default new BasketballController();
