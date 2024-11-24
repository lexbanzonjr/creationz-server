import { Request, Response } from "express";
import axios from "axios";
import qs from "querystring";

import userModel, { IUser } from "../models/userModel";
import { Types } from "mongoose";
import stateModel from "../models/stateModel";
import { responseReturn } from "../utils/response";
import { Locals } from "../middlewares/types";
import { RestError } from "../utils/RestError";
import { createToken } from "../utils/token";

const clientId = process.env.YAHOO_CLIENT_ID;
const clientSecret = process.env.YAHOO_CLIENT_SECRET;
const redirectUri = "https://localhost:5000/yahoo/auth/callback";
const authUrl = "https://api.login.yahoo.com/oauth2/request_auth";
const tokenUrl = "https://api.login.yahoo.com/oauth2/get_token";

interface AuthStateData {
  userId: Types.ObjectId;
}

export class AuthController {
  callback = async (req: Request, res: Response, next: any) => {
    // Verify the state
    const state = await stateModel.get({ _id: req.query.state as string });
    const data = state.data as AuthStateData;
    await stateModel.findByIdAndDelete(state._id);

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

    let user = (await userModel.find({ user: data.userId }))[0];
    if (user === undefined) {
      user = new userModel();
    }

    let tokenExpire = new Date();
    tokenExpire.setSeconds(tokenExpire.getSeconds() + response.data.expires_in);
    user.tokenExpire = tokenExpire;
    user.apiToken = response.data;
    user = await user.save();

    const token = createToken({
      id: user._id,
    });
    res.cookie("yahooToken", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    user.lastLogIn = new Date();
    user.bearer = token;
    user = await user.save();

    responseReturn(res, 200, { bearer: token });

    next();
  };

  login = async (req: Request, res: Response, next: any) => {
    const { userId } = res.locals as Locals;

    let state = new stateModel({ data: res.locals as AuthStateData });
    (state.data as AuthStateData) = { userId };
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
    let user = await userModel.get({ _id: (res.locals as Locals).userId });
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

    user.apiToken = response.data;
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
