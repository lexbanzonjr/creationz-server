import { Request, Response } from "express";
import axios from "axios";
import qs from "querystring";

import stateModel from "../../models/stateModel";
import userModel from "../../models/yahoo/userModel";
import { responseReturn } from "../../utils/response";

const clientId = process.env.YAHOO_CLIENT_ID;
const clientSecret = process.env.YAHOO_CLIENT_SECRET;
const redirectUri = "https://localhost:5000/yahoo/auth/callback";
const authUrl = "https://api.login.yahoo.com/oauth2/request_auth";
const tokenUrl = "https://api.login.yahoo.com/oauth2/get_token";

namespace Yahoo {
  export class authController {
    callback = async (req: Request, res: Response, next: any) => {
      // Verify the state
      const state = await stateModel.findById(req.query.state as string);
      if (null === state) throw Error("State unknown");
      const data = state.data as any;
      state.deleteOne();

      // Process auth code
      const authorizationCode = req.query.code as string;
      const response = await axios.post(
        tokenUrl,
        qs.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code: authorizationCode,
          grant_type: "authorization_code",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const yahooUser = new userModel({
        userId: data?.id,
        data: await response?.data,
      });
      yahooUser.save();

      responseReturn(res, 200);

      next();
    };

    login = async (req: Request, res: Response, next: any) => {
      let state = new stateModel({ data: res.locals });
      state = await state.save();

      const queryParams = qs.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "fspt-r",
        state: state._id.toString(),
      });
      const redirect = `${authUrl}?${queryParams}`;

      if (req.headers.accept === "application/json") {
        responseReturn(res, 200, { redirect });
      } else {
        res.redirect(redirect);
      }

      next();
    };
  }
}

export default new Yahoo.authController();
