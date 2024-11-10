import { Request, Response } from "express";
import BasketballServices from "../../services/yahoo/BasketballServices";

export class BasketballController {
  addDropPlayer = async (req: Request, res: Response, next: any) => {
    next();
  };

  rankings = async (req: Request, res: Response, next: any) => {
    const { access_token } = res.locals.user.token;
    const { league_key, sort, start, status } = req.body;
    const rankings = await BasketballServices.rankings({
      access_token,
      league_key,
      sort,
      start,
      status,
    });
    res.json(rankings);

    next();
  };

  roster = async (req: Request, res: Response, next: any) => {
    const { access_token } = res.locals.user.token;
    const { team_key } = req.body;
    const roster = await BasketballServices.roster({
      access_token,
      team_key,
    });

    res.json(roster);

    next();
  };

  team = async (req: Request, res: Response, next: any) => {
    const { team_key, name } = req.body;
    try {
      res.json(
        await BasketballServices.team({
          access_token: res.locals.user.token.access_token,
          team_key,
          name,
        })
      );
    } catch (error: any) {
      res.send(error);
    }
    next();
  };
}

export default new BasketballController();
