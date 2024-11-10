import { Request, Response } from "express";
import TeamServices from "../services/TeamServices";
import UserServices from "../services/UserServices";

class TeamController {
  get = async (req: Request, res: Response, next: any) => {
    const { leagues } = res.locals.user.fantasy;
    res.json({ leagues });
    next();
  };

  get_sync = async (req: Request, res: Response, next: any) => {
    const { access_token } = res.locals.user.token;
    const { _id } = res.locals.user;
    const { league_key } = req.body;

    // Sync teams
    const team = await TeamServices.get_sync({
      access_token,
      userId: _id,
      league_key,
    });
    res.send(team);
    // // Get user object
    // let user = await UserServices.get({ _id });
    // res.send(user);
    next();
  };
}

export default new TeamController();
