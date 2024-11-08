import { Request, Response } from "express";
import BasketballServices from "../../../services/yahoo/fantasy/BasketballServices";

export class BasketballController {
  roster = async (req: Request, res: Response, next: any) => {
    const accessToken = res.locals.user.token.access_token;
    const team = await BasketballServices.team(accessToken);
    const roster = await BasketballServices.roster(accessToken, team.team_key);

    res.json(roster);

    next();
  };

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
