import { Request, Response } from "express";
import axios from "axios";
import qs from "querystring";

import stateModel from "../../models/stateModel";
import userModel from "../../models/yahoo/userModel";
import { responseReturn } from "../../utils/response";
import { RestError } from "../../utils/RestError";

const clientId = process.env.YAHOO_CLIENT_ID;
const clientSecret = process.env.YAHOO_CLIENT_SECRET;
const redirectUri = "https://localhost:5000/yahoo/auth/callback";
const authUrl = "https://api.login.yahoo.com/oauth2/request_auth";
const tokenUrl = "https://api.login.yahoo.com/oauth2/get_token";

export class AuthController {
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

    let yahooUser = new userModel({
      userId: data?.id,
      token: await response?.data,
    });
    let tokenExpire = new Date();
    tokenExpire.setSeconds(
      tokenExpire.getSeconds() + response?.data.expires_in
    );
    yahooUser.tokenExpire = tokenExpire;
    yahooUser = await yahooUser.save();

    responseReturn(res, 200, { yahooUser });

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

  refreshToken = async (
    req: Request<{}, {}, {}, { redirect?: string }>,
    res: Response,
    next: any
  ) => {
    let user = await userModel.findById(res.locals.user._id);
    if (null === user) throw new RestError("Unknown user", { status: 400 });
    const response = await axios.post(
      tokenUrl,
      qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        refresh_token: res.locals.user.token.refresh_token,
        grant_type: "refresh_token",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    user.token = response.data;
    let tokenExpire = new Date();
    tokenExpire.setSeconds(
      tokenExpire.getSeconds() + response?.data.expires_in
    );
    user.tokenExpire = tokenExpire;
    user = await user.save();

    if (req.query.redirect !== undefined) {
      res.redirect(req.query.redirect);
    } else {
      res.send(user);
    }
    next();
  };
}

export default new AuthController();
