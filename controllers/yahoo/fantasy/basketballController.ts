import { Request, Response } from "express";
import axios from "axios";

namespace Yahoo {
  export class authController {
    team = async (req: Request, res: Response, next: any) => {
      try {
        const response = await axios.get(
          "https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=nba/teams",
          {
            headers: {
              Authorization: `Bearer ${res.locals.user.token.access_token}`,
            },
          }
        );

        res.set("content-type", "text/xml");
        res.send(response.data);
      } catch (error: any) {
        res.send(error);
      }
      next();
    };
  }
}

export default new Yahoo.authController();
