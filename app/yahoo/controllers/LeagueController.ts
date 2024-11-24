import { Request, Response } from "express";
import LeagueServices from "../services/LeagueServices";
import { Locals } from "../middlewares/types";
import userModel from "../models/userModel";

class LeagueController {
  get = async (req: Request, res: Response, next: any) => {
    // Get user object
    const user = await userModel.get({
      _id: (res.locals as Locals).userId,
    });

    // Check if we should sync
    const { sync } = res.locals as Locals;
    if (sync) {
      await LeagueServices.sync({
        access_token: user.apiToken.access_token,
        user,
      });
    }

    let leagues = user.populate("leagues");
    res.json({ leagues });
    next();
  };
}

export default new LeagueController();
