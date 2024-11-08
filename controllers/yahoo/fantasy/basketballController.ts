import { Request, Response } from "express";
import axios from "axios";
import basketballServices from "../../../services/yahoo/fantasy/basketballServices";

namespace Yahoo {
  export class authController {
    team = async (req: Request, res: Response, next: any) => {
      try {
        res.json(
          await basketballServices.team(res.locals.user.token.access_token)
        );
      } catch (error: any) {
        res.send(error);
      }
      next();
    };
  }
}

export default new Yahoo.authController();
