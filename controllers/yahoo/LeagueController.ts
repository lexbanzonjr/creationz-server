import { Request, Response } from "express";
import LeagueServices from "../../services/yahoo/LeagueServices";
import UserServices from "../../services/yahoo/UserServices";

class LeagueController {
  get = async (req: Request, res: Response, next: any) => {
    const { leagues } = res.locals.user.fantasy;
    res.json({ leagues });
    next();
  };

  get_sync = async (req: Request, res: Response, next: any) => {
    const { access_token } = res.locals.user.token;
    const { _id } = res.locals.user;

    // Sync leagues
    await LeagueServices.get_sync({ access_token, userId: _id });

    // Get user object
    let user = await UserServices.get({ _id });
    res.send(user);
    next();
  };
}

export default new LeagueController();
