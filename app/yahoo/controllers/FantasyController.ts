import { Request, Response } from "express";
import FantasyServices from "../services/FantasyServices";

export class FantasyController {
  league = async (req: Request, res: Response, next: any) => {
    const { access_token } = res.locals.user.token;
    const { name } = req.body;
    res.json(await FantasyServices.league({ access_token, name }));

    next();
  };
}

export default new FantasyController();
