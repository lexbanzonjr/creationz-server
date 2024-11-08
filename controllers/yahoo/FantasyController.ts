import { Request, Response } from "express";
import FantasyServices from "../../services/yahoo/fantasy/FantasyServices";

export class FantasyController {
  league = async (req: Request, res: Response, next: any) => {
    const accessToken = res.locals.user.token.access_token;
    res.json(
      await FantasyServices.league(accessToken, "Peanut Gallery 2024-2025")
    );

    next();
  };
}

export default new FantasyController();
