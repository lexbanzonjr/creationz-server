import { Request, Response } from "express";
import TeamServices from "../services/TeamServices";
import { Locals } from "../middlewares/types";
import leagueModel from "../models/leagueModel";

class TeamController {
  get = async (req: Request, res: Response, next: any) => {
    // const { league_key } = req.params;
    // const { sync } = res.locals as Locals;
    // const { access_token } = (res.locals as Locals).user.token;
    // const { userId } = (res.locals as Locals).user;
    // const { leagues } = (res.locals as Locals).user.fantasy;
    // // let team = leagues.find((league) => {
    // //   if (league_key === league.league_key) {
    // //     return true;
    // //   }
    // // })?.team;

    // if (sync) {
    //   res.json(
    //     await TeamServices.sync({
    //       access_token,
    //       userId,
    //       league_key,
    //     })
    //   );
    // }

    // res.json({ team });
    next();
  };
}

export default new TeamController();
