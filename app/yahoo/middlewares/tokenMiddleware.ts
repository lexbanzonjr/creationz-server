import { Request, Response } from "express";
import userModel from "../models/userModel";
import { decodeToken, getToken } from "../utils/token";

export const tokenMiddleware = async (
  req: Request,
  res: Response,
  next: any
) => {
  if (!req.url.includes("/auth")) {
    const yahooToken = getToken(req);

    try {
      const data = decodeToken(yahooToken);
      const user = await userModel.get({ _id: data.id });
      if (new Date() > user.tokenExpire) {
        return res.redirect(
          "/yahoo/auth/refresh_token?redirect=" + req.originalUrl
        );
      }
    } catch (error) {
      return res.status(409).json({ error });
    }
  }
  next();
};
