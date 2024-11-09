import { Request, Response } from "express";
import BasketballServices from "../../../services/yahoo/fantasy/BasketballServices";

export class BasketballController {
  roster = async (req: Request, res: Response, next: any) => {
    const { access_token } = res.locals.user.token;
    const { team_key } = req.body;
    const team = await BasketballServices.team({ access_token });
    const roster = await BasketballServices.roster({
      access_token,
      team_key,
    });

    res.json(roster);

    next();
  };

  team = async (req: Request, res: Response, next: any) => {
    const { access_token } = res.locals.user.token;
    try {
      res.json(
        await BasketballServices.team({ access_token })
      );
    } catch (error: any) {
      res.send(error);
    }
    next();
  };
}

export default new BasketballController();
